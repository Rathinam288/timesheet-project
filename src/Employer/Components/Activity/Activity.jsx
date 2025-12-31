import React, { useState } from 'react';
import './Activity.css';
import ActivityPopup from '../ActivityPopup/ActivityPopup'; 
import { useNotification } from '../Notification/NotificationContext'; 

const Activity = () => {
  const { activityLog } = useNotification();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const closePopup = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="activity-panel enhanced-activity">
      <h3 className="activity-title">Recent Activity...</h3>

      {(activityLog || []).length === 0 ? (
        <p className="no-activity">No recent activities</p>
      ) : (
        activityLog.map((activity, index) => (
          <div
            key={index}
            className={`activity-card enhanced-card ${activity.color || ''}`}
            onClick={() => handleActivityClick(activity)}
          >
            <div className="activity-type">
              <strong>{activity.type}</strong>
            </div>
            <div className="activity-details">
              <span className="activity-user">{activity.user}</span>
              <span className="activity-message">{activity.message}</span>
              <span className="activity-date">{activity.date}</span>
            </div>
          </div>
        ))
      )}

      {selectedActivity && (
        <ActivityPopup activity={selectedActivity} onClose={closePopup} />
      )}
    </div>
  );
};

export default Activity;
