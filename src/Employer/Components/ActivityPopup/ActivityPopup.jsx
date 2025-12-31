import React from 'react';
import './ActivityPopup.css';

 const Popup = ({ activity, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <h3>{activity.type} - Details</h3>
        <p><strong>User:</strong> {activity.user}</p>
        <p><strong>Message:</strong> {activity.message}</p>
        <p><strong>Date:</strong> {activity.date}</p>
      </div>
    </div>
  );
};

export default Popup;
