// import React from 'react';
// import './App.css';
// import { Route, Routes } from 'react-router-dom';
// import Sidebar from './Pages/Sidebar/Sidebar';
// import Navbar from './Pages/Navbar/Navbar';
// import Dashboad from './Pages/Dashboard/Dashboad';
// import Tasks from './Pages/Tasks/Tasks';
// import Leave from './Pages/Leave/Leave/Leave';
// import EmployeeDetail from './Components/empdetails/Employeedetails.jsx';
// import Leavedetails from './Components/Leaveform/Leaveform';
// import Credchange from './Credchange/Credchange';
// import Settings from './Pages/Settings/Settings';
// import { ThemeProvider } from './Components/Theme/ThemeContext';
// import EodMainPage from './Components/EodMain/EodMainPage';
// import Teams from './Teams/Teams';
// import Team1 from './Teams/Team1';
// import Team2 from './Teams/Team2';
// import Team3 from './Teams/Team3';
// import Jira from './Pages/Jira/Jira';
// import Acknowledgement from './Components/Acknowledgement/Acknowledgement';
// import EditImage from './Components/editimage/editimage';
// import SettingNotification from './Pages/SettingNotification/SettingNotification';
// import TimesheetMain from './Pages/Timesheet/Timesheet/TimesheetMain.js';
// import Employeedetail from './Components/empdetails/Employeedetails.jsx';
// import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
// import { Navigate } from 'react-router-dom';
// import RouteProtection from '../RouteProtection/RouteProtection';
// import RequireAuth from './Components/RequiredAuth/RequiredAuth';
 
// const Layout = ({ children }) => {
//   const [collapsed, setCollapsed] = React.useState(false);
 
//   const childrenWithProps = React.Children.map(children, child =>
//     React.isValidElement(child) ? React.cloneElement(child, { collapsed }) : child
//   );
 
//   return (
//     <div className="app">
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
//       <div className={`main ${collapsed ? 'main-expanded' : ''}`}>
//         <Navbar />
//         {childrenWithProps}
//       </div>
//     </div>
//   );
// };
 
// const EmployeeApp = () => {
//   return (
    
//     <div className='employee-app'>
    
//     <ThemeProvider>
//       <RouteProtection allowedRole="employee">
//         <RequireAuth allowedRole="employee">
//       <Routes>
//         <Route path="" element={<Navigate to="dashboard" />} />
 
// <Route path="credchange" element={<PrivateRoute><Credchange /></PrivateRoute>} />
// <Route path="ack" element={<PrivateRoute><Acknowledgement /></PrivateRoute>} />
 
// <Route path="dashboard" element={<PrivateRoute><Layout><Dashboad /></Layout></PrivateRoute>} />
//   {/* <Route path="sorimtechjira" element={<Jira />} /> */}
// <Route path="Leavedetails/edit/:id" element={<PrivateRoute><Layout><Leavedetails /></Layout></PrivateRoute>} />
// <Route path="Leavedetails" element={<PrivateRoute><Layout><Leavedetails /></Layout></PrivateRoute>} />
// <Route path="team" element={<PrivateRoute><Layout><Teams /></Layout></PrivateRoute>} />
// <Route path="team1" element={<PrivateRoute><Layout><Team1 /></Layout></PrivateRoute>} />
// <Route path="team2" element={<PrivateRoute><Layout><Team2 /></Layout></PrivateRoute>} />
// <Route path="team3" element={<PrivateRoute><Layout><Team3 /></Layout></PrivateRoute>} />
// <Route path="Tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
// <Route path="leave" element={<PrivateRoute><Layout><Leave /></Layout></PrivateRoute>} />
// <Route path="Mainsettings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
// <Route path="Profile" element={<PrivateRoute><Layout><EmployeeDetail /></Layout></PrivateRoute>} />
// <Route path="editimage" element={<PrivateRoute><Layout><EditImage /></Layout></PrivateRoute>} />
// <Route path="settingProfile" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
// <Route path="settingnotification" element={<PrivateRoute><Layout><SettingNotification /></Layout></PrivateRoute>} />
// <Route path="eod" element={<PrivateRoute><Layout><EodMainPage /></Layout></PrivateRoute>} />
// <Route path="timesheet" element={<PrivateRoute><Layout><TimesheetMain /></Layout></PrivateRoute>} />
// <Route path="profile/:id" element={<PrivateRoute><Layout><Employeedetail /></Layout></PrivateRoute>} />
 
//       </Routes>
//       </RequireAuth>
//       </RouteProtection>
//     </ThemeProvider>
//     </div>
//   );
// };
//  export default EmployeeApp;

import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Pages/Sidebar/Sidebar';
import Navbar from './Pages/Navbar/Navbar';
import Dashboad from './Pages/Dashboard/Dashboad';
import Tasks from './Pages/Tasks/Tasks';
import Leave from './Pages/Leave/Leave/Leave';
import EmployeeDetail from './Components/empdetails/Employeedetails.jsx';
import Leavedetails from './Components/Leaveform/Leaveform';
import Credchange from './Credchange/Credchange';
import Settings from './Pages/Settings/Settings';
import { ThemeProvider } from './Components/Theme/ThemeContext';
import EodMainPage from './Components/EodMain/EodMainPage';
import Teams from './Teams/Teams';
import Team1 from './Teams/Team1';
import Team2 from './Teams/Team2';
import Team3 from './Teams/Team3';
import Acknowledgement from './Components/Acknowledgement/Acknowledgement';
import EditImage from './Components/editimage/editimage';
import SettingNotification from './Pages/SettingNotification/SettingNotification';
import TimesheetMain from './Pages/Timesheet/Timesheet/TimesheetMain.js';
import Employeedetail from './Components/empdetails/Employeedetails.jsx';
// import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
// import RequireAuth from './Components/RequiredAuth/RequiredAuth';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const childrenWithProps = React.Children.map(children, child =>
    React.isValidElement(child) ? React.cloneElement(child, { collapsed }) : child
  );

  return (
    <div className="app">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`main ${collapsed ? 'main-expanded' : ''}`}>
        <Navbar />
        {childrenWithProps}
      </div>
    </div>
  );
};

const EmployeeApp = () => {
  return (
    <div className='employee-app'>
      <ThemeProvider>
          <Routes>
            {/* Default redirect to dashboard */}
            <Route path="" element={<Navigate to="dashboard" />} />

            <Route path="credchange" element={<Credchange />} />
            <Route path="ack" element={<Acknowledgement />} />

            <Route path="dashboard" element={<><Layout><Dashboad /></Layout></>} />
            <Route path="Leavedetails/edit/:id" element={<><Layout><Leavedetails /></Layout></>} />
            <Route path="Leavedetails" element={<><Layout><Leavedetails /></Layout></>} />
            <Route path="team" element={<><Layout><Teams /></Layout></>} />
            <Route path="team1" element={<><Layout><Team1 /></Layout></>} />
            <Route path="team2" element={<><Layout><Team2 /></Layout></>} />
            <Route path="team3" element={<><Layout><Team3 /></Layout></>} />
            <Route path="Tasks" element={<><Layout><Tasks /></Layout></>} />
            <Route path="leave" element={<><Layout><Leave /></Layout></>} />
            <Route path="Mainsettings" element={<><Layout><Settings /></Layout></>} />
            <Route path="Profile" element={<><Layout><EmployeeDetail /></Layout></>} />
            <Route path="editimage" element={<><Layout><EditImage /></Layout></>} />
            <Route path="settingProfile" element={<><Layout><Settings /></Layout></>} />
            <Route path="settingnotification" element={<><Layout><SettingNotification /></Layout></>} />
            <Route path="eod" element={<><Layout><EodMainPage /></Layout></>} />
            <Route path="timesheet" element={<><Layout><TimesheetMain /></Layout></>} />
            <Route path="profile/:id" element={<><Layout><Employeedetail /></Layout></>} />
          </Routes>
      </ThemeProvider>
    </div>
  );
};

export default EmployeeApp;
