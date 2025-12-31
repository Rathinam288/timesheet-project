const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const DATA_FILE = path.join(__dirname, 'data', 'issues.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/issues', (req, res) => {
  // If JIRA integration enabled, proxy to Jira search (JQL limited to employee scope)
  if (process.env.JIRA_BASE_URL && process.env.REACT_APP_USE_JIRA === 'true') {
    return res.json([]);
  }
  const issues = readData();
  res.json(issues);
});

app.post('/api/issues', (req, res) => {
  // Local create (used when not proxying to Jira)
  const issues = readData();
  const issue = req.body;
  if (!issue.id) {
    issue.id = 'TS-' + Math.floor(100 + Math.random() * 900);
  }
  issue.comments = issue.comments || [];
  issues.unshift(issue);
  writeData(issues);
  res.status(201).json(issue);
});

app.put('/api/issues/:id', (req, res) => {
  // Local update
  const issues = readData();
  const id = req.params.id;
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  issues[idx] = { ...issues[idx], ...req.body };
  writeData(issues);
  res.json(issues[idx]);
});

app.delete('/api/issues/:id', (req, res) => {
  const issues = readData();
  const id = req.params.id;
  const filtered = issues.filter(i => i.id !== id);
  writeData(filtered);
  res.status(204).send();
});

// --- Proxy endpoints for Jira REST API (when configured via env vars) ---
function jiraAuthHeader() {
  if (!process.env.JIRA_BASE_URL) return null;
  // Prefer cloud token (email + token) set in env
  if (process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN) {
    const token = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }
  if (process.env.JIRA_USERNAME && process.env.JIRA_PASSWORD) {
    const token = Buffer.from(`${process.env.JIRA_USERNAME}:${process.env.JIRA_PASSWORD}`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }
  return null;
}

// Simple in-memory session store for OAuth tokens (production: use DB)
const OAUTH_SESSIONS = {};

async function getBearerHeaderForReq(req, res) {
  // If Basic auth env is present, prefer that
  const basic = jiraAuthHeader();
  if (basic) return basic;

  // Try session cookie
  const sid = req.cookies && req.cookies.jira_session;
  if (!sid) return null;
  const sess = OAUTH_SESSIONS[sid];
  if (!sess) return null;

  // Refresh if expired (simple check)
  if (sess.expires_at && Date.now() > sess.expires_at - 60000) {
    try {
      const refreshed = await refreshAccessToken(sess.refresh_token);
      sess.access_token = refreshed.access_token;
      sess.refresh_token = refreshed.refresh_token || sess.refresh_token;
      sess.expires_at = Date.now() + (refreshed.expires_in || 3600) * 1000;
      OAUTH_SESSIONS[sid] = sess;
    } catch (e) {
      console.error('Failed to refresh Jira token', e.message || e);
      return null;
    }
  }

  return { Authorization: `Bearer ${sess.access_token}` };
}

async function refreshAccessToken(refreshToken) {
  const tokenUrl = 'https://auth.atlassian.com/oauth/token';
  const body = {
    grant_type: 'refresh_token',
    client_id: process.env.JIRA_CLIENT_ID,
    client_secret: process.env.JIRA_CLIENT_SECRET,
    refresh_token: refreshToken,
  };
  const resp = await axios.post(tokenUrl, body, { headers: { 'Content-Type': 'application/json' } });
  return resp.data;
}

// OAuth endpoints
app.get('/api/jira/auth', (req, res) => {
  if (!process.env.JIRA_CLIENT_ID || !process.env.JIRA_OAUTH_REDIRECT) return res.status(500).send('Jira OAuth not configured');
  const state = crypto.randomBytes(12).toString('hex');
  // store minimal state in memory (could include returnTo)
  OAUTH_SESSIONS[state] = { created: Date.now() };
  const scopes = encodeURIComponent('read:jira-work write:jira-work offline_access');
  const url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${process.env.JIRA_CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(process.env.JIRA_OAUTH_REDIRECT)}&response_type=code&prompt=consent&state=${state}`;
  res.redirect(url);
});

app.get('/api/jira/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state || !OAUTH_SESSIONS[state]) return res.status(400).send('Invalid callback');
  try {
    const tokenUrl = 'https://auth.atlassian.com/oauth/token';
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      code,
      redirect_uri: process.env.JIRA_OAUTH_REDIRECT,
    };
    const resp = await axios.post(tokenUrl, body, { headers: { 'Content-Type': 'application/json' } });
    const data = resp.data;
    const sid = crypto.randomBytes(16).toString('hex');
    OAUTH_SESSIONS[sid] = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000 };
    // remove temporary state
    delete OAUTH_SESSIONS[state];
    // set cookie
    res.cookie('jira_session', sid, { httpOnly: true, sameSite: 'lax' });
    // redirect to app Jira page
    const frontend = process.env.FRONTEND_BASE_URL || '/';
    res.redirect(frontend + 'employee/jira');
  } catch (e) {
    console.error('Jira callback error', e.message || e);
    res.status(500).send('Failed to exchange code');
  }
});

app.post('/api/jira/refresh', async (req, res) => {
  const sid = req.cookies && req.cookies.jira_session;
  if (!sid || !OAUTH_SESSIONS[sid]) return res.status(400).send('No session');
  try {
    const data = await refreshAccessToken(OAUTH_SESSIONS[sid].refresh_token);
    OAUTH_SESSIONS[sid].access_token = data.access_token;
    OAUTH_SESSIONS[sid].refresh_token = data.refresh_token || OAUTH_SESSIONS[sid].refresh_token;
    OAUTH_SESSIONS[sid].expires_at = Date.now() + (data.expires_in || 3600) * 1000;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).send('refresh failed');
  }
});

app.get('/api/jira/search', async (req, res) => {
  const jql = req.query.jql || '';
  const startAt = req.query.startAt || 0;
  const maxResults = req.query.maxResults || 50;
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.get(`${process.env.JIRA_BASE_URL}/rest/api/3/search`, { params: { jql, startAt, maxResults }, headers });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.get('/api/jira/issue/:id', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.get(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}`, { headers });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.get('/api/jira/issue/:id/transitions', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.get(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}/transitions`, { headers });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.post('/api/jira/issue', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.post(`${process.env.JIRA_BASE_URL}/rest/api/3/issue`, req.body, { headers });
    res.status(201).json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.put('/api/jira/issue/:id/assignee', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  const assignee = req.body.assignee;
  if (!assignee) return res.status(400).send('assignee required');
  try {
    // Try accountId format first (Cloud)
    try {
      const response = await axios.put(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}/assignee`, { accountId: assignee }, { headers });
      return res.json(response.data);
    } catch (e) {
      // Fallback to older name field
      const response2 = await axios.put(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}/assignee`, { name: assignee }, { headers });
      return res.json(response2.data);
    }
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.post('/api/jira/issue/:id/comment', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    // Accept { text: '...' } or { body: ... }
    let body;
    if (req.body && req.body.text) {
      const text = req.body.text;
      body = { body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } };
    } else if (req.body && req.body.body) {
      body = req.body;
    } else {
      body = { body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] } };
    }
    const response = await axios.post(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}/comment`, body, { headers });
    res.status(201).json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.delete('/api/jira/issue/:id', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.delete(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}`, { headers });
    res.status(response.status).send(response.data || 'deleted');
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

app.post('/api/jira/issue/:id/transition', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    const response = await axios.post(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}/transitions`, req.body, { headers });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

// Edit issue fields (summary, description, duedate, labels)
app.put('/api/jira/issue/:id', async (req, res) => {
  const headers = await getBearerHeaderForReq(req, res);
  if (!headers) return res.status(501).send('Jira not configured');
  try {
    // req.body should contain `fields` object per Jira API
    const body = { fields: {} };
    if (req.body.summary !== undefined) body.fields.summary = req.body.summary;
    if (req.body.description !== undefined) body.fields.description = req.body.description;
    if (req.body.duedate !== undefined) body.fields.duedate = req.body.duedate;
    if (req.body.labels !== undefined) body.fields.labels = req.body.labels;
    const response = await axios.put(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}`, body, { headers });
    // Jira returns 204 No Content on success; fetch issue to return updated data
    const updated = await axios.get(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${req.params.id}`, { headers });
    res.json(updated.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.message);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));
