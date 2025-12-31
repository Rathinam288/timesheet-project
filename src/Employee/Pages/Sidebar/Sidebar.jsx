import React from 'react';
import './Sidebar.css';
import Officelogo from '../../Components/OfficeLogo/Officelogo';
import Links from '../../Components/Links/Links';
import { GiHamburgerMenu } from "react-icons/gi";
import logo from '../../assets/SORIM_logo_4.webp';
 
const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div className="sidebar-container">
      {/* Toggle Button */}
      <div className="toggle-icon" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? (
          // <ImCross className="icon cross" />
          <img src={logo} className="iconn cross" id='log'alt="" />
        ) : (
          <GiHamburgerMenu className="iconn ham" />
        )}
      </div>
 
      {/* Sidebar Content */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && <Officelogo />}
        <Links collapsed={collapsed} />
      </div>
    </div>
  );
};
 
export default Sidebar