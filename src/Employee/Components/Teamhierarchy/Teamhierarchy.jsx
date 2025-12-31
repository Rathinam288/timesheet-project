import React, { useState } from 'react';
import Teamhierarchy1 from './Teamhierarchy1/Teamhierarchy1';
import Teamhierarchy2 from './Teamhierarchy2/Teamhierarchy2';
import Teamhierarchy3 from './Teamhierarchy3/Teamhierarchy3';
import '../../Pages/Team/Team.css';

const Teamhierarchy = () => {
  const [selectedTeam, setSelectedTeam] = useState('lms');

  const handleChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div className='teamss'>
      <div id='teams-header'>
        <h1>Our Successful Teams</h1>
        <select onChange={handleChange} value={selectedTeam}>
          <option value="lms">Leave Management System Project</option>
          <option value="ae">Admin and Expenses Bill Project</option>
          <option value="tms">Timesheet Project</option>
        </select>
      </div>

      {selectedTeam === 'lms' && <Teamhierarchy1 />}
      {selectedTeam === 'ae' && <Teamhierarchy2 />}
      {selectedTeam === 'tms' && <Teamhierarchy3 />}
    </div>
  );
};

export default Teamhierarchy;
