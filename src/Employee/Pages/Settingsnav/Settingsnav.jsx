import React from "react";
import { Link } from "react-router-dom";
import "./Settingsnav.css";

function Settingsnav() {
  return (
    <div className="settingsdiv">
      <ul className="settingsnav">
        <li>
          <Link className="sett" to="/employee/settingnotification">Notification</Link>
          <Link className="sett" to="/employee/settingProfile">Settings</Link>
        </li>
      </ul>
          
    </div>
  );
}

export default Settingsnav;
