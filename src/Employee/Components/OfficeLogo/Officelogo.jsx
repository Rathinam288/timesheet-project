import React from "react";
import "./Officelogo.css"
import logo from '../../assets/SORIM_logo_4.webp'

const Officelogo = () => {
  return (
    <div className="logo">
      <img src={logo} alt="office logo" width={250} />
    </div>
  );
};

export default Officelogo;
