import React from 'react'
import Teamhietable1 from './Teamhietable1/Teamhietable1'
import Teamhietable2 from './Teamhietable2/Teamhietable2'
import Teamhietable3 from './Teamhietable3/Teamhietable3'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../Pages/Team/Team.css'

function Teamhietable() {
  const [selectedTeam, setSelectedTeam] = useState('lms');
  const navigate = useNavigate();
    const handleChange = (e) => {
      const value = e.target.value;
      setSelectedTeam(value);
    }
    return (
      <div className='teamss'>
      <div id='teams-header'>
        <h1>Our Successful Teams</h1>
        <select onChange={handleChange} value={selectedTeam}>
          <option value="lms">Leave Management System Project</option>
          <option value="ae">Admin and Expenses Bill Project</option>
          <option value="tms">Timesheet Project</option>
        </select>
        <button onClick={()=>navigate('/Teamhierarchy')}>View Detailed Report</button>
      </div>
  
      {selectedTeam === 'lms' && <Teamhietable1 />}
      {selectedTeam === 'ae' && <Teamhietable2 />}
      {selectedTeam === 'tms' && <Teamhietable3 />}
    </div>
    )
}

export default Teamhietable
