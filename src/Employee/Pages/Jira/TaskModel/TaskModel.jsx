
import React, { useEffect } from "react";
import "./TaskModel.css";

const TaskModal = ({ task, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="mst-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mst-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="mst-modal-top">
          <div className="mst-top-left">
            <button className="mst-icon-btn" title="Add epic">＋</button>
            <span className="mst-breadcrumb">/ {task.id}</span>
          </div>
          <div className="mst-top-right">
            <button className="mst-icon-btn" title="Lock">🔒</button>
            <button className="mst-icon-btn" title="Watchers">👁️ 1</button>
            <button className="mst-icon-btn" title="Share">🔗</button>
            <button className="mst-icon-btn" title="Full screen">⤢</button>
            <button className="mst-icon-btn" title="Close" onClick={onClose}>✖</button>
          </div>
        </div>

        {/* Content */}
        <div className="mst-modal-content">
          <div className="mst-modal-main">
            <h2 className="mst-task-h1">{task.title}</h2>

            <div className="mst-section">
              <div className="mst-section-title">Description</div>
              <div className="mst-section-body">Add a description...</div>
            </div>

            <div className="mst-section">
              <div className="mst-section-title">Subtasks</div>
              <div className="mst-section-body">
                <button className="mst-link">Add subtask</button>
              </div>
            </div>

            <div className="mst-section">
              <div className="mst-section-title">Linked work items</div>
              <div className="mst-section-body">
                <button className="mst-link">Add linked work item</button>
              </div>
            </div>

            <div className="mst-section">
              <div className="mst-section-title">Activity</div>
              <div className="mst-tabs">
                <button className="mst-tab active">All</button>
                <button className="mst-tab">Comments</button>
                <button className="mst-tab">History</button>
                <button className="mst-tab">Work log</button>
              </div>
              <div className="mst-comment-box">
                <input className="mst-comment-input" placeholder="Add a comment..." />
                <div className="mst-reactions">
                  <button className="mst-reaction">🎉 Looks good!</button>
                  <button className="mst-reaction">🆘 Need help?</button>
                  <button className="mst-reaction">⛔ This is blocked...</button>
                  <button className="mst-reaction">🔎 Can you clarify...?</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <aside className="mst-modal-side">
            <div className="mst-panel">
              <div className="mst-panel-header">
                <span>Details</span>
                <button className="mst-icon-btn" title="Configure">⚙️</button>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Assignee</div>
                <div className="mst-value">{task.assignee || "Unassigned"}</div>
                <button className="mst-link">Assign to me</button>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Priority</div>
                <div className="mst-value">None</div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Parent</div>
                <div className="mst-value">None</div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Due date</div>
                <div className="mst-value">{task.date || "None"}</div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Labels</div>
                <div className="mst-value">None</div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Team</div>
                <div className="mst-value">None</div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Development</div>
                <div className="mst-value">
                  <button className="mst-link">Create branch</button>
                  <button className="mst-link">Create commit</button>
                </div>
              </div>

              <div className="mst-panel-row">
                <div className="mst-label">Reporter</div>
                <div className="mst-value">GNANARATHINAM C</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
