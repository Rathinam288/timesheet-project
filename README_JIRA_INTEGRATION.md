# Jira Integration (proxy) — Setup

This project includes a lightweight server proxy to forward requests to a Jira instance (Cloud or Server).

1) Install dependencies

```bash
npm install
# then install server deps if needed (they are in package.json)
```

2) Configure environment

Copy `.env.example` to `.env` (for server) and set your Jira credentials. Example variables:

- `REACT_APP_USE_JIRA=true` to enable real Jira integration
- `REACT_APP_API_URL=http://localhost:4000`
- `JIRA_BASE_URL=https://your-domain.atlassian.net`
- `JIRA_EMAIL` and `JIRA_API_TOKEN` for Jira Cloud (recommended) OR `JIRA_USERNAME` and `JIRA_PASSWORD` for Server.
- `PORT=4000`

3) Run the server and frontend

In one terminal:

```bash
npm run start:server
```

In another terminal:

```bash
npm start
```

4) Notes

- The server exposes local fallback endpoints under `/api/issues` (JSON file) when Jira is not configured.
- When `REACT_APP_USE_JIRA=true` the frontend will call `/api/jira/*` endpoints on the server. The server will forward them to the Jira REST API using the credentials in the environment.
- The server implements safe proxy endpoints for search, get issue, create issue, add comment, transitions, assign, and delete. Credentials must be stored locally (do not commit).

If you want me to wire user-specific Jira credentials (so each employee acts with their own Jira account), tell me and I'll add an auth flow.
