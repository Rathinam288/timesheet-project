import React from "react";
import { FiSearch, FiMenu, FiHelpCircle, FiSettings } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { SiJira } from "react-icons/si";
import "./Header.css";

const Header = ({ onToggleSidebar }) => {
  return (
    <div className="jira-header">
      {/* LEFT SECTION */}
      <div className="left-section">
        <FiMenu
          className="collapse-icon"
          onClick={onToggleSidebar}
        />

        <div className="jira-logo">
          <SiJira />
          <span>Jira</span>
        </div>

        <div className="jira-search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="jira-search"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <button className="jira-create-btn">+  Create</button>
        <IoIosNotificationsOutline className="header-icon" />
        <FiHelpCircle className="header-icon" />
        <FiSettings className="header-icon" />
        <div className="jira-profile">GC</div>
      </div>
    </div>
  );
};

export default Header;
