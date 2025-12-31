 import React, { useState } from "react";
 import { Bell } from "lucide-react";
 import { toast } from "react-toastify";
 import { useNotification } from "./NotificationContext";

import "./notification.css";

 const Notification = () => {
  const { notifications, markAllAsSeen, acceptNotification, rejectNotification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

 const handleAccept = (id) => {
  toast.success("Accepted successfully!");
  acceptNotification(id);
};

  const handleReject = (id) => {
  toast.error("Rejected!");
  rejectNotification(id);
};

 

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <Bell />
        {notifications.filter((n) => !n.seen).length > 0 && (
          <span className="notification-count">
            {notifications.filter((n) => !n.seen).length}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          {notifications.length === 0 ? (
            <ul className="notification-list">
              <li>No notifications</li>
            </ul>
          ) : (
            <>
              <button className="mark-btn" onClick={markAllAsSeen}>
                Mark All as Seen
              </button>
              <ul className="notification-list">
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className={note.seen ? "seen" : "unseen"}
                  >
                    <strong>{note.title}:</strong> {note.message}
                    <div className="timestamp">{note.timestamp}</div>
                    {!note.seen && (
                      <div className="btn-group">
                        <button
                          className="accept-btn"
                          onClick={() => handleAccept(note.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(note.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
