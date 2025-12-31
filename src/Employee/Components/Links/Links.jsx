// // src/Employee/Components/Links/Links.js
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Links.css";
// import { IoHomeSharp } from "react-icons/io5";
// import { SiJira } from "react-icons/si";
// import { HiUserGroup } from "react-icons/hi";
// import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { IoMdTime } from "react-icons/io";

// const Links = ({ collapsed }) => {
//   const navigate = useNavigate();

//   // Jira URL (freely accessible)
//   const JIRA_URL = `${window.location.origin}/sorimtechjira`;

//   // Logout handler
//   const handleLogout = () => {
//     // Clear all session / local storage
//     localStorage.clear();
//     sessionStorage.clear();
//     // Redirect to login page
//     navigate("/");
//   };

//   return (
//     <div className="links">
//       <ul>
//         <li>
//           <Link to="/employee/dashboard" className="dash">
//             <IoHomeSharp />
//             {!collapsed && <span>Dashboard</span>}
//           </Link>
//         </li>

//         {/* Jira opens in new tab */}
//         <li>
//           <a href={JIRA_URL} target="_blank" rel="noopener noreferrer" className="dash">
//             <SiJira />
//             {!collapsed && <span>Jira</span>}
//           </a>
//         </li>

//         <li>
//           <Link to="/employee/timesheet" className="dash">
//             <IoMdTime />
//             {!collapsed && <span>Timesheet</span>}
//           </Link>
//         </li>

//         <li>
//           <Link to="/employee/leave" className="dash">
//             <FaRegCalendarAlt />
//             {!collapsed && <span>Leave</span>}
//           </Link>
//         </li>

//         <li>
//           <Link to="/employee/team" className="dash">
//             <HiUserGroup />
//             {!collapsed && <span>Team</span>}
//           </Link>
//         </li>

//         <li>
//           <Link to="/employee/Mainsettings" className="dash">
//             <IoSettingsOutline />
//             {!collapsed && <span>Settings</span>}
//           </Link>
//         </li>

//         {/* Logout */}
//         <li>
//           <button onClick={handleLogout} className="dash logout-btn">
//             <IoLogOutOutline />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Links;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Links.css";
import { IoHomeSharp } from "react-icons/io5";
import { SiJira } from "react-icons/si";
import { HiUserGroup } from "react-icons/hi";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const Links = ({ collapsed }) => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="links">
      <ul>
        <li>
          <Link to="/employee/dashboard" className="dash">
            <IoHomeSharp />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </li>

        {/* Jira navigation */}
   <a
  href={`${window.location.origin}/sorimtechjira`}
  target="_blank"
  rel="noopener noreferrer"
  className="dash"
>
  <SiJira />
  {!collapsed && <span>Jira</span>}
</a>

        <li>
          <Link to="/employee/timesheet" className="dash">
            <IoMdTime />
            {!collapsed && <span>Timesheet</span>}
          </Link>
        </li>

        <li>
          <Link to="/employee/leave" className="dash">
            <FaRegCalendarAlt />
            {!collapsed && <span>Leave</span>}
          </Link>
        </li>

        <li>
          <Link to="/employee/team" className="dash">
            <HiUserGroup />
            {!collapsed && <span>Team</span>}
          </Link>
        </li>

        <li>
          <Link to="/employee/Mainsettings" className="dash">
            <IoSettingsOutline />
            {!collapsed && <span>Settings</span>}
          </Link>
        </li>

        {/* Logout */}
        <li>
          <button onClick={handleLogout} className="dash logout-btn">
            <IoLogOutOutline />
            {!collapsed && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Links;
