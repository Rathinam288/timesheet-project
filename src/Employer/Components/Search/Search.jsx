import React, { useState, useEffect, useRef } from "react";
import "../Search/Search.css";
import { CiSearch } from "react-icons/ci";
import Notification from "../Notification/notification";
import Adminprofile from "../Adminprofile/Adminprofile";
import defaultImg from "../../assets/client7.jpg"; // default fallback

const Search = () => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [employee, setEmployee] = useState(null);
  const profileRef = useRef();

  const empId = localStorage.getItem("employeeId");

  const handleProfileClick = () => {
    setShowProfileCard((prev) => !prev);
  };

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!empId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/employees/employee/${empId}`
        );
        const data = await res.json();
        setEmployee(data);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      }
    };

    fetchEmployee();
  }, [empId]);

  // Click outside to close profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search">
      <div className="inputs">
        <input
          className="searchinput"
          type="search"
          placeholder="Search Here..."
        />
        <div className="serachicon">
          <CiSearch />
        </div>
      </div>

      <div className="profile" ref={profileRef}>
        <div className="notify">
          <Notification />
        </div>

        <div className="admin-name">
          <h4>{employee ? employee.employeeName : "ADMIN"}</h4>
        </div>

        <div className="adminimg" onClick={handleProfileClick}>
          <img
            src={
              employee?.profilePicPath?.startsWith("data:image")
                ? employee.profilePicPath
                : employee?.profilePicPath
                ? `http://localhost:8080/uploads/${employee.profilePicPath}`
                : defaultImg
            }
            alt="admin"
          />
        </div>

        {showProfileCard && <Adminprofile />}
      </div>
    </div>
  );
};

export default Search;
