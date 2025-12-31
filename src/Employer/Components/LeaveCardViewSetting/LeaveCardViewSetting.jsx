import './LeaveCardViewSetting.css';

const LeaveNotification = [
  {
    user: 'Afzal Rahman (Dev)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Approved',
  },
  {
    user: 'Telusco (Client)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Pending',
  },
  {
    user: 'Rathinam (TL)',
    from:'24.06.2025',
    to: '24.06.2025',
    status: 'Rejected',
  },
   {
    user: 'Telusco (Client)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Pending',
  },
   {
    user: 'Telusco (Client)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Pending',
  },
   {
    user: 'Telusco (Client)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Pending',
  },
   {
    user: 'Telusco (Client)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Pending',
  },
];
 function LeaveCardViewSetting() {
  return (
    <>
    <h3 className="Leave-title">Leave Status...</h3>
<div className="Leave-Notification">
      
      {LeaveNotification.map((activity, index) => (
        <div key={index} className="Leave-Notification-card">
      
          <div className="Leave-details">
            <span className="Leave-user">{activity.user}</span>
            <span className="Leave-from">{activity.from}</span>
            <span className="Leave-to">{activity.to}</span>
           <span className={`Leave-status status-${activity.status.toLowerCase()}`}>{activity.status}</span>

          </div>
        </div>
      ))}
    </div>
    
    
    </>
  )
}

export default LeaveCardViewSetting