import React from 'react';
import './name.css';

function NameFilter({ searchName, setSearchName }) {
  return (
    <div className='name'>
      <label className='date-label'>Search by Name: </label>
      <input
        type="text"
        className='name-data'
        placeholder="Enter employee name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
    </div>
  );
}

export default NameFilter;
