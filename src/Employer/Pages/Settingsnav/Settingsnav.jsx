import React from 'react'
 import { Link } from 'react-router-dom'
import './Settingsnav.css'


 function Settingsnav() {
  return (
    <div className='settingsdiv'>
<ul className='settingsnav'>
  <li><Link className='sett' to="/employer/settingProfile">Profile</Link></li>
  <li><Link className='sett' to="/employer/settingNotification">Notification</Link></li>
  <li><Link className='sett' to="/employer/settingEmp">Employee</Link></li>

</ul>


</div>
  )
}

export default Settingsnav;