// // // src/App.js
// // import React, { useEffect, useState } from 'react';
// // import './App.css';
// // import EmployeeApp from './Employee/App';
// // import EmployerApp from './Employer/App';
// // import Login from './Login/Login';
// // import { Route, Routes, useLocation } from 'react-router-dom';
// // import Jira from './Employee/Pages/Jira/Jira';

// // function App() {
// //   const [role, setRole] = useState(localStorage.getItem("role"));
// //   const location = useLocation();

// //   // Update role if URL changes
// //   useEffect(() => {
// //     const savedRole = localStorage.getItem("role");
// //     setRole(savedRole);
// //   }, [location.pathname]);

// //   return (
// //     <div className="App">
// //       <Routes>
// //   <Route path="/" element={<Login />} />

// //   {role === "employee" && <Route path="/employee/*" element={<EmployeeApp />} />}
// //   {role === "employer" && <Route path="/employer/*" element={<EmployerApp />} />}

// //   {/* Jira route always accessible */}
// //   <Route path="/sorimtechjira" element={<Jira />} />

// //   {/* Optional fallback to login */}
// //   <Route path="*" element={<Login />} />
// // </Routes>

// //     </div>
// //   );
// // }

// // export default App;


// import React, { useEffect, useState } from 'react';
// import './App.css';
// import EmployeeApp from './Employee/App';
// import EmployerApp from './Employer/App';
// import Login from './Login/Login';
// import { Route, Routes, useLocation } from 'react-router-dom';
// import Jira from './Employee/Pages/Jira/Jira';

// function App() {
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   const location = useLocation();

//   useEffect(() => {
//     const savedRole = localStorage.getItem("role");
//     setRole(savedRole);
//   }, [location.pathname]);

//   return (
//     <div className="App">
//       <Routes>
//         {/* Public Login */}
//         <Route path="/" element={<Login />} />

//         {/* Public Jira route (freely accessible) */}
//         <Route path="/sorimtechjira" element={<Jira />} />

//         {/* Protected Employee routes */}
//         {role === "employee" && <Route path="/employee/*" element={<EmployeeApp />} />}

//         {/* Protected Employer routes */}
//         {role === "employer" && <Route path="/employer/*" element={<EmployerApp />} />}

//         {/* Fallback to login */}
//         <Route path="*" element={<Login />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import "./App.css";
import EmployeeApp from "./Employee/App";
import EmployerApp from "./Employer/App";
import Login from "./Login/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import Jira from "./Employee/Pages/Jira/Jira";
import JiraProtected from "./JiraProtected";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const location = useLocation();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [location.pathname]);

  return (
    <div className="App">
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Jira – employee only */}
        <Route
          path="/sorimtechjira"
          element={
            <JiraProtected>
              <Jira />
            </JiraProtected>
          }
        />

        {/* Employee */}
        {role === "employee" && (
          <Route path="/employee/*" element={<EmployeeApp />} />
        )}

        {/* Employer */}
        {role === "employer" && (
          <Route path="/employer/*" element={<EmployerApp />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
