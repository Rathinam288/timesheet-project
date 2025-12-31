import React, { useState } from 'react';
import './notification.css';

const Notification = ({ employeeName, fromDate, toDate, status, previousLeaves, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="notification-container">
      <div className="notification-popup">
        <button className="close-btn" onClick={handleClose}>×</button>
        <h4>Notification</h4> <br />
        <p>
          <strong>{employeeName}</strong>, your leave from <strong>24.06.2025</strong> to <strong>24.06.2025</strong> has been <strong>Approved</strong>.
        </p>
        <br />
        <p>
          <strong>{employeeName}</strong>, your leave from <strong>20.05.2025</strong> to <strong>22.05.2025</strong> has been <strong>Pending</strong>.
        </p>
        <br />
        <p>
          <strong>{employeeName}</strong>, your leave from <strong>02.05.2025</strong> to <strong>04.05.2025</strong> has been <strong>Rejected</strong>.
        </p>
      </div>
    </div>
  );
};

export default Notification;