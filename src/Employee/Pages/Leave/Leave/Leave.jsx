import React, { useState } from "react";
import "./Leave.css";
import Upcoming from "./Upcoming/Upcoming";
import Status from "./Status/Status";
import Calender from "./Calender/Calender/Calander";
import LeaveBalance from "./Leavebalance/Leavebalance/Leavebalance";
import { Link } from "react-router-dom";

function Leave({ collapsed }) {
  const [rec, setrec] = useState(false);

  const handleToggle = () => {
    setrec((prev) => !prev);
  };

  return (
    <div id="leave">
      <div className="lee">
        <div className="leaveid">{/* <Leavedummy/> */}</div>
        <div
          id="nav-buttons"
          className={`nav-buttons ${collapsed ? "collapsed" : "expanded"}`}
        >
          <button className="nav-button" onClick={handleToggle}>
            {rec ? "Leave Balance" : "Show Calendar"}
          </button>
          <Link to="/employee/Leavedetails" className="nav-button">
            Request Leave
          </Link>
          <Link to="/employee/timesheet" className="nav-button">
            Time Sheet
          </Link>
        </div>
        <div className={`clanup ${collapsed ? "cal-col" : ""}`}>
          {rec ? <Calender collapsed={collapsed} /> : <LeaveBalance />}
          <div className={`upco ${collapsed ? "upco-col" : ""}`}>
            <Upcoming />
          </div>
        </div>

        <div>
          <Status collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}

export default Leave;
