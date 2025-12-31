import React from 'react'
import './TicketCardViewSetting.css';

const TicketNotification = [
  {
    id:"LMS1123",
    ticket: 'Add button for leave request',
    reportingmanager: 'Senthil',
    enddate: '22.04.2025',
    status: 'Blocked',
  },
  {
    id:"LMS1124",
   ticket: 'Add payslip for the employees',
    reportingmanager: 'Senthil',
    enddate: '27.06.2025',
    status: 'Open',
  },
  {
    id:"LMS1122",
    ticket: 'Add leave policy for employee',
    reportingmanager: 'Senthil',
    enddate: '30.06.2025',
    status: 'Open',
  },
   {
    id:"LMS1120",
   ticket: 'Add upcoming leaves in calendar',
    reportingmanager: 'Rama',
    enddate: '3.07.2025',
    status: 'Closed',
  },
   {
    id:"LMS1128",
    ticket: 'Add timesheet for the employees',
    reportingmanager: 'Rama',
    enddate: '10.07.2025',
    status: 'Closed',
  },
   {
    id:"LMS1129",
    ticket: 'Add table for timesheet entries',
    reportingmanager: 'Rama',
    enddate: '21.07.2025',
    status: 'Open',
  },
];
function TicketCardViewSetting() {
  return (
    <>
    <h3 className="Ticket-title">Ticket Status...</h3>
<div className="Ticket-Notification">
      
      {TicketNotification.map((activity, index) => (
        <div key={index} className="Ticket-Notification-card">
      
          <div className="Ticket-details">
            <span className='Ticket-id'>{activity.id}</span>
            <span className="Ticket-ticket">{activity.ticket}</span>
            <span className="Ticket-reportingmanager">{activity.reportingmanager}</span>
            <span className="Ticket-to">{activity.enddate}</span>
           <span className={`Ticket-status status-${activity.status.toLowerCase()}`}>{activity.status}</span>

          </div>
        </div>
      ))}
    </div>
    
    
    </>
  )
}

export default TicketCardViewSetting