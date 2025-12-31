import React from 'react';
import './date.css';

function DateFilter({ searchDate, setSearchDate }) {
  return (
    <div className='date-container'>
      <label className='date-label'>Search by Date: </label>
      <input
        type="date"
        className='date-data'
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)} // Update date on change
      />
    </div>
  );
}

export default DateFilter;
