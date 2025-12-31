// src/RouteProtection/JiraProtected.jsx
import { Navigate } from "react-router-dom";

const JiraProtected = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "employee") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default JiraProtected;
