// import { Navigate } from "react-router-dom";

// const RouteProtection = ({ children, roleRequired }) => {
//   const role = localStorage.getItem("role");

//   if (!role) {
//     return <Navigate to="/" replace />;
//   }

//   if (roleRequired && role !== roleRequired) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default RouteProtection;