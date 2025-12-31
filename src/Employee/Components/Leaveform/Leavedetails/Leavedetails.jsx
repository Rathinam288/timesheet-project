import React, { useState, useEffect } from "react";
import "./Leavedetails.css";
import Img from "../../../assets/thankyou 1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";
import LeaveBalance from "../../../Pages/Leave/Leave/Leavebalance/Leavebalance/Leavebalance";

function Leavedetails({ collapsed }) {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("");
  const [dayType, setDayType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [showDaysCard, setShowDaysCard] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [fromAmPm, setFromAmPm] = useState("AM");
  const [toTime, setToTime] = useState("");
  const [toAmPm, setToAmPm] = useState("AM");
  const [duration, setDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rec, setRec] = useState(false);
  const [reporting_manager, setReportingManager] = useState("Kavya Maran");
  const [leaveRecord, setLeaveRecord] = useState([]);

  // 🔄 IDs
  const [leaveRecordId, setLeaveRecordId] = useState(null);
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const empId = routeParamId || routeStateId || storedId;

  const handleToggle = () => setRec(!rec);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/leaves/record/${empId}`)
      .then((response) => {
        setLeaveRecord(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [empId]);
  const getLeaveDayText = () => {
    if (leaveType === "Casual Leave (CLR)")
      return `Casual Leave – ${leaveRecord.rem_casual_leave} Days`;
    if (leaveType === "Sick Leave (SLR)")
      return `Sick Leave – ${leaveRecord.rem_sick_leave} Days`;
    if (leaveType === "Permission (PRR)")
      return `Total Permission – ${leaveRecord.rem_permission} Hours Remaining`;
    return "";
  };

  useEffect(() => {
    if (leaveType === "Permission (PRR)" && dayType === "Full Day") {
      setDayType("");
    }
  }, [leaveType, dayType]);

  // 🔁 Prefill Leave Details
  useEffect(() => {
    if (empId) {
      axios
        .get(`http://localhost:8080/api/leaves/${empId}`)
        .then((res) => {
          const r = res.data;

          setLeaveRecordId(r.id);
          setLeaveType(r.leave_type);
          setFromDate(r.from_date);
          setToDate(r.to_date);
          setDayType(r.leave_duration || "");
          setReason(r.reason || "");
          setComment(r.comment || "");
          setReportingManager(r.reporting_manager);

          if (r.from_time) {
            const [fh, fm] = r.from_time.split(":").map(Number);
            const isPM = fh >= 12;
            const h12 = fh % 12 === 0 ? 12 : fh % 12;
            setFromTime(
              `${String(h12).padStart(2, "0")}:${String(fm).padStart(2, "0")}`
            );
            setFromAmPm(isPM ? "PM" : "AM");
          }

          if (r.to_time) {
            const [th, tm] = r.to_time.split(":").map(Number);
            const isPM = th >= 12;
            const h12 = th % 12 === 0 ? 12 : th % 12;
            setToTime(
              `${String(h12).padStart(2, "0")}:${String(tm).padStart(2, "0")}`
            );
            setToAmPm(isPM ? "PM" : "AM");
          }

          setDuration(r.duration || "");
          setShowDaysCard(true);
          setShowDetailsCard(true);
        })
        .catch((err) => console.log("Prefill error: " + err));
    }
  }, [empId]);

  // 🔁 Auto-calculate duration for full day leave
  useEffect(() => {
    if (fromDate && toDate && leaveType !== "Permission (PRR)") {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = to - from;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays > 0 ? diffDays : "");
    }
  }, [fromDate, toDate, leaveType]);

  // 🔁 Auto-calculate duration for permission
  useEffect(() => {
    if (
      leaveType === "Permission (PRR)" &&
      fromTime &&
      toTime &&
      fromDate === toDate
    ) {
      let [fh, fm] = fromTime.split(":").map(Number);
      let [th, tm] = toTime.split(":").map(Number);

      if (fromAmPm === "PM" && fh !== 12) fh += 12;
      if (fromAmPm === "AM" && fh === 12) fh = 0;
      if (toAmPm === "PM" && th !== 12) th += 12;
      if (toAmPm === "AM" && th === 12) th = 0;

      const from = new Date(0, 0, 0, fh, fm);
      const to = new Date(0, 0, 0, th, tm);
      let diff = (to - from) / (1000 * 60 * 60);
      if (diff < 0) diff += 24;

      setDuration(diff.toFixed(2));
    }
  }, [fromTime, toTime, fromAmPm, toAmPm, fromDate, toDate, leaveType]);

  const handleLeaveTypeClick = (type) => {
    setLeaveType(type);
    setShowDaysCard(true);
    setShowDetailsCard(false);
  };

  const handleLeaveDaysClick = () => setShowDetailsCard(!showDetailsCard);

  const convertTo24Hour = (time, ampm) => {
    let [h, m] = time.split(":").map(Number);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !leaveType ||
      !fromDate ||
      !toDate ||
      !dayType ||
      !reason ||
      (leaveType === "Permission (PRR)" && (!fromTime || !toTime))
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    setErrorMessage("");
    setSubmitted(true);

    const leaveData = {
      emp_id: empId,
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
      leave_duration: dayType,
      description: reason,
      reason,
      comment,
      no_of_leave_days: duration,
      ...(leaveType === "Permission (PRR)" && {
        from_time: convertTo24Hour(fromTime, fromAmPm),
        to_time: convertTo24Hour(toTime, toAmPm),
        no_of_hours: duration,
      }),
      reporting_manager,
      total_sick_leave: leaveRecord.totalSickLeave,
      total_casual_leave: leaveRecord.totalCasualLeave,
      rem_casual_leave: leaveRecord.remCasualLeave,
      rem_sick_leave: leaveRecord.remSickLeave,
      tot_permission: leaveRecord.totalPermission,
      rem_permission: leaveRecord.remPermssion,
      overall_leave: leaveRecord.overallLeave,
    };

    try {
      if (leaveRecordId) {
        await axios.put(
          `http://localhost:8080/api/leaves/update/${leaveRecordId}`,
          leaveData
        );
        console.log("Leave updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/leaves/create", leaveData);
        console.log("Leave created successfully");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
    }

    setTimeout(() => navigate("/employee/leave"), 3000);
  };

  return (
    <>
      {submitted && <div className="blur-backdrop"></div>}
      {submitted && (
        <div className="thankyou-popup">
          <img src={Img} alt="Thank You" className="thankyou-img" />
        </div>
      )}

      <div className={`form-container ${submitted ? "blurred" : ""}`}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* <div className={`clanup ${collapsed?'cal-col':''}`}> */}
        {/* {rec ? <LeaveBalance /> : <Calender />} */}
        <div
          id="nav-buttons"
          className={`nav-buttons ${collapsed ? "collapsed" : "expanded"}`}
        >
          <Link to="/employee/leave" className="nav-button">
            Show Calendar
          </Link>
          <button className="nav-button" onClick={handleToggle}>
            {rec ? "Leave Form" : "Leave Balance"}
          </button>
          <Link to="/employee/Timesheet" className="nav-button">
            Time Sheet
          </Link>
        </div>
        {rec ? (
          <div id="form-lb">
            <LeaveBalance />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="leaverathish">Leave Application</h2>

            <div className="leave-summary">
              <div className="card">
                <h3>Overall Leave</h3>
                <p>{leaveRecord.overall_leave} Days</p>
              </div>
              <div className="card">
                <h3>Total Sick Leave</h3>
                <p>{leaveRecord.total_sick_leave} Days</p>
              </div>
              <div className="card">
                <h3>Total Casual Leave</h3>
                <p>{leaveRecord.total_casual_leave} Days</p>
              </div>
            </div>

            <div className="manager">
              <label className="reporting" htmlFor="reportingManager">
                Reporting Manager
              </label>
              <select
                className="report"
                name="reporting_manager"
                value={reporting_manager}
                onChange={(e) => setReportingManager(e.target.value)}
                defaultValue="Kavya Maran"
              >
                <option>Kavya Maran</option>
                <option>Senthil Palani</option>
                <option>Rama</option>
              </select>
            </div>

            <div className="leave-type">
              <label className="leave-detail">Leave Type</label>
              <div className="map-leave">
                {[
                  "Casual Leave (CLR)",
                  "Sick Leave (SLR)",
                  "Permission (PRR)",
                ].map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="leaveType"
                      value={type}
                      checked={leaveType === type}
                      onChange={() => handleLeaveTypeClick(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {showDaysCard && (
              <div className="leave-days-card" onClick={handleLeaveDaysClick}>
                <h4>{getLeaveDayText()}</h4>

                <small>(Click here to apply leave)</small>
              </div>
            )}

            {showDetailsCard && (
              <div className="leave-details-card">
                <div className="card-header">
                  <h4>Leave Details</h4>
                  <span
                    className="minimize-icon"
                    onClick={handleLeaveDaysClick}
                    title="Minimize"
                  >
                    &minus;
                  </span>
                </div>

                <div className="date-range">
                  <div className="from">
                    <label className="begin" htmlFor="fromDate">
                      From
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      className="date"
                      value={fromDate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setFromDate(selectedDate);
                        if (leaveType === "Permission (PRR)") {
                          setToDate(selectedDate);
                        }
                      }}
                    />
                  </div>

                  <div className="to">
                    <label className="leave-to" htmlFor="toDate">
                      To
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      className="datas"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>

                  {leaveType !== "Permission (PRR)" && (
                    <div className="leave-duration">
                      <label className="duration" htmlFor="duration">
                        No of leave days
                      </label>
                      <input
                        type="number"
                        id="leave-dur"
                        className="leave-durat"
                        value={duration}
                        readOnly
                      />
                    </div>
                  )}
                </div>

                <div className="map-from">
                  {leaveType !== "Permission (PRR)" && (
                    <label>
                      <input
                        type="radio"
                        name="dayType"
                        value="Full Day"
                        checked={dayType === "Full Day"}
                        onChange={(e) => setDayType(e.target.value)}
                      />
                      <span>Full Day</span>
                    </label>
                  )}

                  <label>
                    <input
                      type="radio"
                      name="dayType"
                      value="First Half"
                      checked={dayType === "First Half"}
                      onChange={(e) => setDayType(e.target.value)}
                    />
                    <span>First Half</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="dayType"
                      value="Second Half"
                      checked={dayType === "Second Half"}
                      onChange={(e) => setDayType(e.target.value)}
                    />
                    <span>Second Half</span>
                  </label>
                </div>

                {leaveType === "Permission (PRR)" &&
                  (dayType === "First Half" || dayType === "Second Half") && (
                    <div className="time-duration">
                      <div className="from-time">
                        <label htmlFor="fromTime">From Time</label>
                        <input
                          type="time"
                          id="fromTime"
                          value={fromTime}
                          onChange={(e) => setFromTime(e.target.value)}
                        />
                      </div>

                      <div className="to-time">
                        <label htmlFor="toTime">To Time</label>
                        <input
                          type="time"
                          id="toTime"
                          value={toTime}
                          onChange={(e) => setToTime(e.target.value)}
                        />
                      </div>

                      <div className="leave-durations">
                        <label className="duration" htmlFor="duration">
                          No of Hours
                        </label>
                        <input
                          type="number"
                          id="leave-dur"
                          className="leave-durat"
                          value={duration}
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                <label htmlFor="reason" id="reason">
                  Reason
                </label>
                <input
                  type="text"
                  id="reasons"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <label htmlFor="comment" id="comment">
                  Comment
                </label>
                <textarea
                  id="comments"
                  className="comment-box"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
          </form>
        )}
        {/* </div> */}

        <div className="decision">
          <button
            type="button"
            className="cancel"
            onClick={() => navigate("/employee/leave")}
          >
            Cancel
          </button>
          <button type="submit" className="apply-leave" onClick={handleSubmit}>
            Apply Leave
          </button>
        </div>
      </div>
    </>
  );
}

export default Leavedetails;
