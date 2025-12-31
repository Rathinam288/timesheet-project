import React from 'react'
import './Button.css'
import { Link } from 'react-router-dom';

function Button() {
  return (
    <Link to={'/Leavedetails'}className='request'>
      <div className='btnleave'>
           <button className='requestbtn'>Request Leave</button>
      </div>
    </Link>
  )
}

export default Button;