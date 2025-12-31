import React from 'react';
 import { FaEye } from 'react-icons/fa';
import './Down.css'
 const View = ({ label, onClick }) => {
  return (
    <button className="action-btn" onClick={onClick}>

    <FaEye />
      {label}
      
    </button>
  );
};
export default View;