import './LeaveCardViewSetting.css';

const LeaveNotification = [
  {
    user: 'Tamilselvan (Dev)',
    from: '24.06.2025',
    to: '24.06.2025',
    status: 'Approved',
  },
  {
    user: 'Tamilselvan (Dev)',
    from: '20.05.2025',
    to: '22.05.2025',
    status: 'Pending',
  },
  {
    user: 'Tamilselvan (Dev)',
    from:'02.05.2025',
    to: '04.05.2025',
    status: 'Rejected',
  },
   {
    user: 'Tamilselvan (Dev)',
    from: '24.04.2025',
    to: '24.04.2025',
    status: 'Pending',
  },
   {
    user: 'Tamilselvan (Dev)',
    from: '17.04.2025',
    to: '17.04.2025',
    status: 'Pending',
  },
   {
    user: 'Tamilselvan (Dev)',
    from: '15.04.2025',
    to: '15.04.2025',
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