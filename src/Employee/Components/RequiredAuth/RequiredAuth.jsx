// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const RequireAuth = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const empId = localStorage.getItem("employeeId"); // Retrieve empId from localStorage or wherever it's stored
//         const role = localStorage.getItem("role"); // Get the role to pass in the header

//         // Ensure empId and role exist before proceeding with the request
//         if (!empId || !role) {
//           setAuthenticated(false);
//           setLoading(false);
//           return;
//         }

//         // Send custom headers (empId and role) to the server for session check
//         const res = await fetch("http://localhost:8080/api/checkSession", {
//           method: "GET",
//           headers: {
//             "X-Employee-Id": empId, // Pass empId in the header
//             "X-Role": role, // Pass the role in the header
//           },
//           credentials: "include", // Optional: you can still include cookies for additional data
//         });

//         if (res.status === 200) {
//           const data = await res.json();
//           console.log("Session OK:", data);
//           setAuthenticated(true);
//         } else {
//           console.warn("Session expired or not found");
//           setAuthenticated(false);
//         }
//       } catch (error) {
//         console.error("Session check failed:", error);
//         setAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkSession();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!authenticated) return <Navigate to="/" replace />;

//   return children;
// };

// export default RequireAuth;
