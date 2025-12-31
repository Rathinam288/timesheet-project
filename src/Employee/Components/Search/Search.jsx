import React, { useEffect, useState } from "react";
import "./Search.css";
import { CiSearch } from "react-icons/ci";
import { IoNotifications } from "react-icons/io5";
import Male from "../../assets/Me.png";
import Notification from "../../Notification/Notification";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [pfp, setPfp] = useState([]);
  const employeeId = localStorage.getItem("employeeId");
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const id = routeParamId || routeStateId || storedId;
  useEffect(() => {
    const getpfp = async () => {
      try {
        const pfpres = await axios.get(
          `http://localhost:8080/api/employees/employee/${id}`
        );
        setPfp(pfpres.data);
        console.log(pfpres.data);
      } catch (err) {
        console.log("error fetching pfp image : " + err);
      }
    };
    getpfp();
  }, [id]);
  const previousLeaves = [
    {
      from: "2025-03-10",
      to: "2025-03-12",
      reason: "Sick leave",
      status: "approved",
    },
    {
      from: "2025-01-05",
      to: "2025-01-07",
      reason: "Casual Leave",
      status: "pending",
    },
    {
      from: "2024-12-20",
      to: "2024-12-25",
      reason: "Permission",
      status: "rejected",
    },
    {
      from: "2024-12-20",
      to: "2024-12-25",
      reason: "Permission",
      status: "approved",
    },
  ];

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
      <div className="profile">
        <div className="notify" onClick={() => setShowNotification(true)}>
          <IoNotifications />
        </div>
        <div className="adminimg">
          <h4 className="sgap">{pfp.employeeName}</h4>
          <Link to={`/employee/Profile/${employeeId}`}>
            <img
              src={
                pfp?.profilePicPath?.startsWith("data:image")
                  ? pfp.profilePicPath
                  : pfp?.profilePicPath
                  ? `http://localhost:8080/uploads/${pfp.profilePicPath}`
                  : Male
              }
              alt="admin"
            />
          </Link>
        </div>
      </div>
      {showNotification && (
        <Notification
          employeeName="Tamilselvan"
          fromDate="2025-05-01"
          toDate="2025-05-05"
          status="approved"
          previousLeaves={previousLeaves}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Search;
