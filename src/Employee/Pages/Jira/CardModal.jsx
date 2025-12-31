import React, { useState, useEffect } from 'react';
import './Jira.css';

const useJira = (process.env.REACT_APP_USE_JIRA === 'true');

const CardModal = ({ card, onClose, onSave, onDelete }) => {
  const [editable, setEditable] = useState({ ...card });
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditable({ ...card });
    // if integrating with Jira and the card has a raw key, fetch full details
    async function loadDetails() {
      if (!useJira) return;
      if (!card || !card.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/jira/issue/${encodeURIComponent(card.id)}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const mapped = {
          id: data.key,
          title: data.fields.summary,
          description: (typeof data.fields.description === 'string') ? data.fields.description : '',
          dueDate: data.fields.duedate || '',
          assignee: data.fields.assignee ? (data.fields.assignee.displayName || data.fields.assignee.name) : '',
          reporter: data.fields.reporter ? (data.fields.reporter.displayName || data.fields.reporter.name) : '',
          labels: data.fields.labels || [],
          comments: (data.fields.comment?.comments || []).map(c => ({ id: c.id, author: c.author?.displayName || c.author?.name, text: (c.body?.content?.[0]?.content?.[0]?.text) || (c.body?.toString ? c.body.toString() : ''), ts: c.created }))
        };
        setEditable(mapped);
      } catch (e) {
        console.error('Failed to load issue details', e);
      } finally { setLoading(false); }
    }
    loadDetails();
  }, [card]);

  function save() {
    if (useJira && editable && editable.id) {
      // update via server proxy
      (async () => {
        try {
          const body = { summary: editable.title, description: editable.description, duedate: editable.dueDate, labels: editable.labels };
          const res = await fetch(`/api/jira/issue/${encodeURIComponent(editable.id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          if (!res.ok) throw new Error(await res.text());
          const updated = await res.json();
          onSave({ ...editable, raw: updated });
        } catch (e) { console.error('Failed to save to Jira', e); onSave(editable); }
        onClose();
      })();
    } else {
      onSave(editable);
      onClose();
    }
  }

  function addComment() {
    if (!commentText.trim()) return;
    const text = commentText.trim();
    if (useJira && editable && editable.id) {
      (async () => {
        try {
          const res = await fetch(`/api/jira/issue/${encodeURIComponent(editable.id)}/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
          if (!res.ok) throw new Error(await res.text());
          const added = await res.json();
          const c = { id: added.id || Date.now().toString(), author: localStorage.getItem('employeeName') || 'You', text, ts: new Date().toISOString() };
          const updated = { ...editable, comments: [...(editable.comments || []), c] };
          setEditable(updated);
          onSave(updated);
          setCommentText('');
        } catch (e) { console.error('Failed to post comment', e); }
      })();
    } else {
      const c = { id: Date.now().toString(), author: localStorage.getItem('employeeName') || 'You', text, ts: new Date().toISOString() };
      const updated = { ...editable, comments: [...(editable.comments || []), c] };
      setEditable(updated);
      onSave(updated);
      setCommentText('');
    }
  }

  function assignToMe() {
    const me = localStorage.getItem('employeeName') || (process.env.REACT_APP_JIRA_DEFAULT_ASSIGNEE || 'You');
    if (useJira && editable && editable.id) {
      (async () => {
        try {
          const res = await fetch(`/api/jira/issue/${encodeURIComponent(editable.id)}/assignee`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assignee: me }) });
          if (!res.ok) throw new Error(await res.text());
          setEditable(prev => ({ ...prev, assignee: me }));
          onSave({ ...editable, assignee: me });
        } catch (e) { console.error('Failed to assign', e); }
      })();
    } else {
      const updated = { ...editable, assignee: me };
      setEditable(updated); onSave(updated);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-left">
          <div className="modal-top">
            <h2>{editable.title}</h2>
            <div className="modal-actions">
              <button onClick={() => { setEditable(prev => ({ ...prev, title: prompt('Title', prev.title) || prev.title })); }}>Edit</button>
              <button onClick={() => onDelete(editable.id)}>Delete</button>
            </div>
          </div>
          <div className="modal-section">
            <h4>Description</h4>
            <textarea value={editable.description || ''} onChange={e => setEditable({ ...editable, description: e.target.value })} />
          </div>

          <div className="modal-section">
            <h4>Activity</h4>
            <div className="comments">
              {(editable.comments || []).map(c => (
                <div key={c.id} className="comment">
                  <div className="comment-author">{c.author} • {new Date(c.ts).toLocaleString()}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))}
            </div>
            <div className="add-comment">
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." />
              <div className="comment-actions">
                <button onClick={addComment}>Add Comment</button>
              </div>
            </div>
          </div>

        </div>
        <div className="modal-right">
          <div className="details">
            <div className="detail-row"><strong>Assignee</strong><div>{editable.assignee || 'Unassigned'}</div></div>
            <div className="detail-row"><strong>Reporter</strong><div>{editable.reporter || ''}</div></div>
            <div className="detail-row"><strong>Due date</strong>
              <div><input type="date" value={editable.dueDate || ''} onChange={e => setEditable({ ...editable, dueDate: e.target.value })} /></div>
            </div>
            <div className="detail-row"><strong>Labels</strong><div>{(editable.labels||[]).join(', ') || 'None'}</div></div>
            <div className="detail-actions">
              <button onClick={assignToMe}>Assign to me</button>
              <button onClick={save}>Save</button>
            </div>
            <div className="dev-actions">
              <div><a href="#" onClick={e => e.preventDefault()}>Create branch</a></div>
              <div><a href="#" onClick={e => e.preventDefault()}>Create commit</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
