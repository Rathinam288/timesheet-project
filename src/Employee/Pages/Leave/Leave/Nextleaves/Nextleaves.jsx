import React from 'react'
import './Nextleaves.css'

function Nextleaves() {

     const upcomingHolidayss = [
    { date: '15/08/2025', name: 'Independence Day' },
    { date: '06/09/2025', name: 'Vinayagar Chaturthi' },
    { date: '31/10/2025', name: 'Diwali' },
    { date: '25/12/2025', name: 'Christmas' }
  ];

  return (
  <div className="info-card" id='next-holl'>
  <h3 className='heads'>📌 Upcoming Holidays</h3>
  <ul>
    {upcomingHolidayss.map((holiday, idx) => (
      <li key={idx}>{holiday.date} - <span className='new'>{holiday.name}</span></li>
    ))}
  </ul>
</div>
  )
}

export default Nextleaves
