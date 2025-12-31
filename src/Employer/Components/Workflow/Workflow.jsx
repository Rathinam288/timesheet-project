import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFolder,
  FaUsers,
  FaUserFriends,
  FaTasks,
  FaCheckSquare,
} from "react-icons/fa";
import "./Workflow.css";
import axios from "axios";

const Workflow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalTeams: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    totalProjects: 0,
  });

  const fetchStats = async () => {
    try {
      const [clientsRes, projectsRes, teamsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/clients"),
        axios.get("http://localhost:8080/api/projects"),
        axios.get("http://localhost:8080/api/team"),
      ]);

      setStats({
        totalClients: clientsRes.data.length,
        totalTeams: teamsRes.data.length,
        inProgressProjects: projectsRes.data.filter(
          (proj) => proj.status === "In Progress"
        ).length,
        completedProjects: projectsRes.data.filter(
          (proj) => proj.status === "Done"
        ).length,
        totalProjects: projectsRes.data.filter(
          (proj) => proj.status === "Not Started"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching workflow stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchStats();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const statItems = [
    {
      icon: <FaUsers />,
      label: "Total Clients",
      value: stats.totalClients,
      color: "#223b78",
      route: "/employer/clients",
    },
    {
      icon: <FaUserFriends />,
      label: "Total Teams",
      value: stats.totalTeams,
      color: "#223b78",
      route: "/employer/teams",
    },
    {
      icon: <FaTasks />,
      label: "Ongoing Task",
      value: stats.inProgressProjects,
      color: "#223b78",
      route: "/employer/projects",
      status: "In Progress",
    },
    {
      icon: <FaCheckSquare />,
      label: "Completed",
      value: stats.completedProjects,
      color: "#223b78",
      route: "/employer/projects",
      status: "Done",
    },
    {
      icon: <FaFolder />,
      label: "Not Started",
      value: stats.totalProjects,
      color: "#223b78",
      route: "/employer/projects",
      status: "Not Started",
    },
  ];

  const handleNavigation = (item) => {
    if (item.status) {
      navigate(`${item.route}?status=${encodeURIComponent(item.status)}`);
    } else {
      navigate(item.route);
    }
  };

  return (
    <div className="stat-card-container">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="stat-card"
          onClick={() => handleNavigation(item)}
          style={{ backgroundColor: item.color, cursor: "pointer" }}
        >
          <div className="stat-icon">{item.icon}</div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Workflow;
