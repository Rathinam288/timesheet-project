// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Loginform.css";

// import Loginbutton from "../Loginbutton/Loginbutton";
// import { IoLockClosedOutline } from "react-icons/io5";
// import { ImEyeBlocked, ImEye } from "react-icons/im";
// import { FaUser } from "react-icons/fa";

// function Loginform() {
//   const [error, setError] = useState("");
//   const [empId, setEmpId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const { data, status } = await axios.post(
//         "http://localhost:8080/api/login",
//         { empId, password },
//         { withCredentials: true }
//       );

//       console.log("data", data);

//       if (status === 200) {
//         console.log("Login response:", data);
//         const employeeId = data.empId;

//         localStorage.setItem("employeeId", employeeId);
//         localStorage.setItem("role", data.access);
//         localStorage.setItem("loginTime", new Date().toISOString());

//         if (data.mustChangePassword) {
//           navigate(`/${data.access}/credchange`);
//         } 
        
//         else {
//           navigate(`/${data.access}/dashboard`);
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Invalid EmpId or Password");
//     }
//   };

//   return (
//     <div className="form">
//       <form className="login-form" onSubmit={handleLogin}>
//         <label htmlFor="empId">Employee ID</label>
//         <div className="g">
//           <FaUser className="icon" />
//           <input
//             type="text"
//             id="empId"
//             required
//             className="loginform"
//             value={empId}
//             onChange={(e) => setEmpId(e.target.value)}
//           />
//         </div>

//         <label htmlFor="password">Password</label>
//         <div className="g">
//           <IoLockClosedOutline className="icon" />
//           <input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             required
//             className="loginform"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span
//             className="icon1"
//             onClick={() => setShowPassword((prev) => !prev)}
//           >
//             {showPassword ? <ImEye /> : <ImEyeBlocked />}
//           </span>
//         </div>

//         <Loginbutton />

//         {error && <p className="errors-message">{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default Loginform;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Loginform.css";

import Loginbutton from "../Loginbutton/Loginbutton";
import { IoLockClosedOutline } from "react-icons/io5";
import { ImEyeBlocked, ImEye } from "react-icons/im";
import { FaUser } from "react-icons/fa";

function Loginform() {
  const [error, setError] = useState("");
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const { data, status } = await axios.post(
      "http://localhost:8080/api/login",
      { empId, password },
      { withCredentials: true }
    );

    if (status === 200) {
      // Save auth
      localStorage.setItem("employeeId", data.empId);
      localStorage.setItem("role", data.access);
      localStorage.setItem("loginTime", new Date().toISOString());

      // 1️⃣ Force React state + storage to settle
      setTimeout(() => {
        if (data.mustChangePassword) {
          navigate(`/${data.access}/credchange`);
        } 
        
      else if (data.access === "employee") {
  // Go to dashboard first
  navigate("/employee/dashboard");
}
        
        else {
          navigate(`/${data.access}/dashboard`);
        }
      }, 300); // small delay is IMPORTANT
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Invalid EmpId or Password");
  }
};


  return (
    <div className="form">
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="empId">Employee ID</label>
        <div className="g">
          <FaUser className="icon" />
          <input
            type="text"
            id="empId"
            required
            className="loginform"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="g">
          <IoLockClosedOutline className="icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="loginform"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="icon1"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <ImEye /> : <ImEyeBlocked />}
          </span>
        </div>

        <Loginbutton />

        {error && <p className="errors-message">{error}</p>}
      </form>
    </div>
  );
}

export default Loginform;
