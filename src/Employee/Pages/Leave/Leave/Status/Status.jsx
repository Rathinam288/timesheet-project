import React from 'react'
import './Status.css'
import Nextleaves from '../Nextleaves/Nextleaves';

function Status({collapsed}) {
  const upcomingBirthdays = [
    { name: 'Jane Doe', date: '2025-06-18' },
    { name: 'Michael Lee', date: '2025-06-21' },
  ];
  return (
    <div className='stat' >
       
          <Nextleaves/>
          <div className="info-card" id='next-hol'>
            <h3 className='heads'>🎉 Upcoming Birthdays</h3>
            <ul>
              {upcomingBirthdays.map((b, idx) => (
                <li key={idx}>{new Date(b.date).toLocaleDateString('en-GB')} - <span className='new'>{b.name}</span></li>
              ))}
            </ul>
          </div>
    </div>
    
  )
}
export default Status;
