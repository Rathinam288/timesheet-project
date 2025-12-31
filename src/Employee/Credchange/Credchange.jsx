import React, { useEffect, useState } from "react";
import "./Credchange.css";
import { IoLockClosedOutline } from "react-icons/io5";
import { ImEyeBlocked, ImEye } from "react-icons/im";
import pwdpopup from "../assets/password.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Credchange() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mustChangePassword, setMustChangePassword] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/mustChangePassword",
          {
            withCredentials: true,
          }
        );
        setMustChangePassword(response.data.mustChangePassword);

        if (!response.data.mustChangePassword) {
          navigate("/employee/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching password status:", error);
        navigate("/employee/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("❌ New password and Confirm password do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/change",
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/employee/ack"); // You can change this to "/employee/dashboard" if preferred
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert("❌ " + error.response.data.message);
      } else {
        alert("❌ Password change failed. Try again.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!mustChangePassword) return null;

  return (
    <div id="mas">
      <div id="container">
        <h2 id="cp">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div id="formWrapper">
            <div className="row">
              <label>Current Password</label>
              <div className="group">
                <IoLockClosedOutline className="icon" />
                <input
                  className="input"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <span
                  className="icon1"
                  onClick={() => setShowCurrent((prev) => !prev)}
                >
                  {showCurrent ? <ImEye /> : <ImEyeBlocked />}
                </span>
              </div>
            </div>

            <div className="row">
              <label>New Password</label>
              <div className="group">
                <IoLockClosedOutline className="icon" />
                <input
                  className="input"
                  type={showNew ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="icon1"
                  onClick={() => setShowNew((prev) => !prev)}
                >
                  {showNew ? <ImEye /> : <ImEyeBlocked />}
                </span>
              </div>
            </div>

            <div className="row">
              <label>Confirm Password</label>
              <div className="group">
                <IoLockClosedOutline className="icon" />
                <input
                  className="input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="icon1"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <ImEye /> : <ImEyeBlocked />}
                </span>
              </div>
            </div>
          </div>
          <button type="submit" id="submit">
            Submit
          </button>
        </form>

        {showSuccess && (
          <div id="overlay">
            <div id="pwdpopup">
              <img src={pwdpopup} alt="Password Changed" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Credchange;
