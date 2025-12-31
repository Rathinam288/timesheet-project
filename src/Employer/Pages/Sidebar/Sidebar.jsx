
import React from 'react';
import './Sidebar.css';
import Officelogo from '../../Components/OfficeLogo/Officelogo';
import Links from '../../Components/Links/Links';

 const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" onClick={toggleSidebar}>
        <Officelogo isCollapsed={collapsed} />
      </div>

      <div className="sidebar-links">
        <Links isCollapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;

