import React from 'react'
 import { upcomingBirthdays } from "../overallclient/Overallclient.js"
 import { upcomingHolidays } from '../overallclient/Overallclient.js'

 const EmpBirthday = () => {
  return (
    <div className="upcoming-section">
          <div className="upcoming-card">
            <h3>🎉 Upcoming Holidays</h3>
            <ul>
              {upcomingHolidays.map((h, i) => (
                <li key={i}><strong>{h.name}</strong> — {h.date}</li>
              ))}
            </ul>
          </div>

          <div className="upcoming-card">
            <h3>🎂 Employee Birthdays</h3>
            <ul>
              {upcomingBirthdays.map((b, i) => (
                <li key={i}><strong>{b.name}</strong> — {b.date}</li>
              ))}
            </ul>
          </div>
        </div>
  )
}

export default EmpBirthday
