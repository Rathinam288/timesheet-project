

import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Pages/Sidebar/Sidebar';
import Navbar from './Pages/Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Projects from './Pages/ProjectsUI/Projects';
import Clients from './Pages/Clients/Clients';
import Reports from './Pages/Reports/Reports';
import Settings from './Pages/Settings/Settings';
import Expence from './Pages/Expence/Expence';
import Timesheet from './Pages/Timesheet/Timesheet';
import Form from './Components/Form/Form';
import { ThemeProvider } from './Components/Theme/ThemeContext';
import Mainsettings from './Pages/Mainsettings/Mainsettings';
import Team from './Pages/Team/Team';
import Leaverecord from './Pages/Leave/Leaverecord';
import TeamDetails from './Components/Teamhietable/TeamDetails';
import ClientCompanyDetails from './Components/ClientCompanyDetails/ClientCompanyDetails.jsx';
import ClientDetails from './Components/ClientDetails/ClientDeatils.jsx';
import SettingEmp from './Pages/SettingsEmployee/SettingEmp.jsx';
import SettingNotification from './Pages/SettingNotification/SettingNotification.jsx';
import RegisterFormPopup from './Pages/Users/RegisterFormPopup.jsx';
import { NotificationProvider } from "./Components/Notification/NotificationContext.jsx";
import { Navigate } from 'react-router-dom';
import './Employerapp.css';
import Adminprofile from './Components/Adminprofile/Adminprofile.jsx';
import Credchange from './Components/Credchange/Credchange.jsx';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="employer-app">

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`main ${collapsed ? 'main-expanded' : ''}`}>
        <Navbar />
        <div className="content">
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { collapsed })
              : child
          )}
        </div>
      </div>
    </div>
  );
};

const EmployerApp = () => {

  return (
    <NotificationProvider>
      <ThemeProvider>
        <Routes>
          <>
            <Route path='' element={<Navigate to='/employer/dashboard' />} />
            <Route path="credchange" element={<Credchange />} />
            <Route path="dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="projects" element={<Layout><Projects /></Layout>} />
            <Route path="clients" element={<Layout><Clients /></Layout>} />
            <Route path="expence" element={<Layout><Expence /></Layout>} />
            <Route path="leave" element={<Layout><Leaverecord /></Layout>} />
            <Route path="timesheet" element={<Layout><Timesheet /></Layout>} />
            <Route path="reports" element={<Layout><Reports /></Layout>} />
            <Route path="team/:id" element={<Layout><TeamDetails /></Layout>} />
            <Route path="teams" element={<Layout><Team /></Layout>} />
            <Route path="settings" element={<Layout><Mainsettings /></Layout>} />
            <Route path="client/:clientId" element={<Layout><ClientDetails /></Layout>} />
            <Route path="client/:clientId/details" element={<Layout><ClientCompanyDetails /></Layout>} />
            <Route path="clients/edit/:clientId" element={<Layout><Form /></Layout>} />
            <Route path="settingProfile" element={<Layout><Settings /></Layout>} />
            <Route path='adminprofile' element={<Layout><Adminprofile /></Layout>}/>
            <Route path="form" element={<Layout><Form /></Layout>} />
            <Route path="settingNotification" element={<Layout><SettingNotification /></Layout>} />
            <Route path="settingEmp" element={<Layout><SettingEmp /></Layout>} />
            <Route path="adduser" element={<Layout><RegisterFormPopup /></Layout>} />
          </>
          {/* )} */}
        </Routes>
      </ThemeProvider>
    </NotificationProvider>
  );
};

export default EmployerApp;
