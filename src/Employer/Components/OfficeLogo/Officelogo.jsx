
import React from "react";
import "./Officelogo.css";
import logo from '../../assets/ofiiceLogo.webp';

 const Officelogo = ({ isCollapsed }) => {
  return (
    <div className={`logo-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default Officelogo;