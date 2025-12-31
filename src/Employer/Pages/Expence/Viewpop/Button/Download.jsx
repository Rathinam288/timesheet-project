
 import { FaDownload } from "react-icons/fa";
import React from "react";
import './Down.css'
 const ActionButton = ({ label, onClick }) => {
  return (
    <button className="action-btn" onClick={onClick}>

    <FaDownload />
      {label}
      
    </button>
  );
};

export default ActionButton;