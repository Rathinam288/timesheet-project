import React from 'react';
import '../Links/Links.css';
 import { NavLink } from 'react-router-dom';
 import { IoHomeSharp } from "react-icons/io5";
 import { FaFileInvoice } from "react-icons/fa";
 import { LiaUsersSolid } from "react-icons/lia";
 import { HiUserGroup } from "react-icons/hi";
 import { IoSettingsOutline } from "react-icons/io5";
 import { HiDocumentReport } from "react-icons/hi";
 import { IoTimeOutline } from "react-icons/io5";
 import { SiExpensify } from "react-icons/si";
 import { FaRegCalendarAlt } from "react-icons/fa";

 const Links = ({ isCollapsed }) => {
  return (
    <div className='links'>
      <ul>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/dashboard'}>
          <IoHomeSharp />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/projects'}>
          <FaFileInvoice />
          {!isCollapsed && <span>Project</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/clients'}>
          <LiaUsersSolid />
          {!isCollapsed && <span>Clients</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/leave'}>
          <FaRegCalendarAlt />
          {!isCollapsed && <span>Our Leaves</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/timesheet'}>
          <IoTimeOutline />
          {!isCollapsed && <span>Time-Sheet</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/expence'}>
          <SiExpensify />
          {!isCollapsed && <span>Expense</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/adduser'}>
          <HiUserGroup />
          {!isCollapsed && <span>User</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/reports'}>
          <HiDocumentReport />
          {!isCollapsed && <span>Reports</span>}
        </NavLink>
        
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/teams'}>
          <HiUserGroup />
          {!isCollapsed && <span>Team</span>}
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'dash active' : 'dash'} to={'/employer/settingProfile'}>
          <IoSettingsOutline />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </ul>
    </div>
  );
};

export default Links;
