import React, { useEffect, useState } from "react";
import "./Adminprofile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultImg from "../../assets/client8.jpg";

const Adminprofile = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const empId = localStorage.getItem("employeeId");
  console.log("Employee ID from localStorage:", empId);
  const role = localStorage.getItem("role");
  console.log(role);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/employees/employee/${empId}`
        );
        setEmployee(res.data);
        console.log("Employee data fetched:", res.data.employeeName);
      } catch (err) {
        console.error("Failed to fetch employee:", err);
      }
    };

    if (empId) {
      fetchEmployee();
    }
  }, [empId]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleEmpdashboard = () => {
    localStorage.setItem("role", "employee");
    localStorage.setItem("employeeId", empId);
    localStorage.setItem("loginTime", new Date().toISOString());
    navigate("/employee/dashboard");
  };

  return (
    <div className="admin-profile-card">
      <img className="profile-image" src={employee?.profilePicPath?.startsWith("data:image")
                ? employee.profilePicPath
                : employee?.profilePicPath
                ? `http://localhost:8080/uploads/${employee.profilePicPath}`
                : defaultImg} alt="Profile" />

      {employee ? (
        <>
          <h2 className="profile-name">Name: {employee.employeeName}</h2>
          <p className="profile-role">Designation: {employee.designation}</p>
          <p className="profile-email">Email: {employee.email}</p>
        </>
      ) : (
        <p>NO Data Available🤷‍♀️</p>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {role === "employer" && (
        <button className="dashboard-button" onClick={handleEmpdashboard}>
          Switch to Employee Dashboard
        </button>
      )}
    </div>
  );
};

export default Adminprofile;
