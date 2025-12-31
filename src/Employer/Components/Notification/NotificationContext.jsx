import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  const addNotification = (title, message, extra = {}) => {
    const note = {
      id: Date.now(),
      title,
      message,
      seen: false,
      timestamp: new Date().toLocaleString(),
      extra
    };
    setNotifications(prev => [note, ...prev]);
  };

  const acceptNotification = id => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, seen: true } : n))
    );
    const note = notifications.find(n => n.id === id);
    if (!note) return;

    // Map each title case
    const typeMap = [
      {
        key: "Leave",
        type: "Leave Approved",
        color: "teal",
        builder: n => `Leave (${n.extra.from}–${n.extra.to}) by ${n.extra.employeeName} approved`
      },
      {
        key: "Timesheet",
        type: "Timesheet Approved",
        color: "navy",
        builder: n => `Timesheet (${n.extra.date}) by ${n.extra.employeeName} approved`
      },
      {
        key: "User",
        type: "User Joined",
        color: "violet",
        builder: n => `User ${n.extra.employeeName} joined as ${n.extra.designation}`
      },
      {
        key: "Report",
        type: "Report Uploaded",
        color: "yellow",
        builder: n => `Report '${n.extra.reportName}' for project ${n.extra.projectId} uploaded`
      },
      // Add more as needed
    ];

    const mapping = typeMap.find(m => note.title.includes(m.key)) || {
      type: "Accepted",
      color: "green",
      builder: n => `Accepted: ${n.message}`
    };

    const activity = {
      type: mapping.type,
      user: note.extra.employeeName || "System",
      message: mapping.builder(note),
      date: new Date().toLocaleDateString(),
      color: mapping.color
    };
    setActivityLog(prev => [activity, ...prev]);
  };

  const rejectNotification = id => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, seen: true } : n))
    );
    const note = notifications.find(n => n.id === id);
    if (!note) return;

    const activity = {
      type: "Rejected",
      user: note.extra.employeeName || "System",
      message: `Rejected: ${note.message}`,
      date: new Date().toLocaleDateString(),
      color: "red"
    };
    setActivityLog(prev => [activity, ...prev]);
  };

  const markAllAsSeen = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      activityLog,
      addNotification,
      acceptNotification,
      rejectNotification,
      markAllAsSeen
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
