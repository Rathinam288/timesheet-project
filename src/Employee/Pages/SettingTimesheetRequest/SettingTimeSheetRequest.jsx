import React from "react";
import "./SettingTimeSheetRequest.css";
const TimeRequest = [
  {
    userid: "101",
    missing: "IN-TIME",
    timein: "8:00 AM",
    reason: "Page error",
  },
  {
    userid: "102",
    missing: "Out-TIME",
    timeout: "4:00 PM",
    reason: "Page error",
  },
  {
    userid: "103",
    missing: "IN-TIME",
    timein: "8:00 AM",
    reason: "Page error",
  },
];
function SettingTimeSheetRequest() {
  return (
      <div className="Time-Notification">
        <h3 className="Time-Notification-title">Time Request...</h3>
        {TimeRequest.map((activity, index) => (
          <div key={index} className="Time-Notification-card">
            <div className="Time-details">
              <span className="Time-userid">User Id : {activity.userid}</span>
              <span className="Time-missing" data-type={activity.missing}>
                {activity.missing}
              </span>

              <span className="Time-timein">Time In : {activity.timein}</span>
              <span className="Time-timeout">Time Out : {activity.timeout}</span>
              <span className="Time-reason">Reason : {activity.reason}</span>
            </div>
          </div>
        ))}
      </div>
  );
}

export default SettingTimeSheetRequest;
