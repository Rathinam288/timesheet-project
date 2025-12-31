import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Infocards.css";
import "../../Pages/Timesheet/Timesheet/Timesheet.css";
import { useParams, useLocation } from "react-router-dom";

const holidaysMaster = [
  { date: "2025-08-15", name: "Independence Day" },
  { date: "2025-09-06", name: "Vinayagar Chaturthi" },
  { date: "2025-10-21", name: "Diwali" },
  { date: "2025-12-25", name: "Christmas" },
];

const birthdaysMaster = [
  { name: "Jane Doe", date: "2025-06-18" },
  { name: "Michael Lee", date: "2025-06-21" },
  { name: "Rahul Sharma", date: "2025-07-15" },
];

function Infocards() {
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const id = routeParamId || routeStateId || storedId;
  const empId = routeParamId || routeStateId || storedId;

  const [leave, setLeave] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState({
    id: "",
    name: "",
    dob: "",
  });

  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  const parseDOB = (dobString) => {
    if (!dobString) return null;
    const dateOnly = dobString.split(" ")[0];
    return new Date(dateOnly);
  };

  // difference in days
  const daysUntil = (targetDate) => {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const end = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 🟢 Get employee leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/leaves/employee/${empId}`
        );
        setLeave(res.data);
      } catch (err) {
        console.error("Error fetching leave data", err);
      }
    };
    fetchLeaves();
  }, [empId]);

  // 🟢 Get employee info
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/employees/employee/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEmployeeInfo({
            id: data.empId,
            name: data.employeeName,
            dob: data.dateOfBirth,
          });
        })
        .catch((err) => console.error("Failed to fetch employee info", err));
    }
  }, [id]);

  // 🟢 Process holidays & birthdays (UI-only)
  useEffect(() => {
    const today = new Date();

    // Filter & sort holidays
    const filteredHolidays = holidaysMaster
      .map((h) => ({ ...h, dateObj: new Date(h.date) }))
      .filter((h) => h.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);

    setUpcomingHolidays(filteredHolidays);

    // Filter & sort birthdays
    const filteredBirthdays = birthdaysMaster
      .map((b) => ({ ...b, dateObj: new Date(b.date) }))
      .filter((b) => b.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);

    setUpcomingBirthdays(filteredBirthdays);
  }, []);

  // 🟢 Helpers
  const getAge = (dob) => {
    const birthDate = parseDOB(dob);
    if (!birthDate || isNaN(birthDate)) return "N/A";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getDaysUntilNextBirthday = (dob) => {
    const birthDate = parseDOB(dob);
    if (!birthDate || isNaN(birthDate)) return "N/A";
    const today = new Date();
    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const diffInTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
  };

  const previousLeaves = leave.map((l) => ({
    date: l.from_date,
    reason: l.reason,
  }));

  return (
    <div>
      <div className="center-info-panels">
        {/* Employee Info */}
        <div className="info-card">
          <h3 className="heads">👤 Employee Info</h3>
          <h4>
            <strong>ID:</strong> <span className="new">{employeeInfo.id}</span>
          </h4>
          <h4>
            <strong>Name:</strong>{" "}
            <span className="new">{employeeInfo.name}</span>
          </h4>
        </div>

        {/* Month & Year */}
        <div className="info-card">
          <h3 className="heads">📅 Month & Year</h3>
          <h4>
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h4>
        </div>

        {/* Dynamic Upcoming Holidays */}
        <div className="info-card">
          <h3 className="heads">📌 Upcoming Holidays</h3>
          <ul>
            {upcomingHolidays.length > 0 ? (
              upcomingHolidays.map((holiday, idx) => (
                <li key={idx}>
                  {holiday.dateObj.toLocaleDateString("en-GB")} -
                  <span className="new">{holiday.name}</span>
                  <div style={{ fontSize: "0.85em", color: "#777" }}>
                    {daysUntil(holiday.dateObj) === 0
                      ? "Today"
                      : `${daysUntil(holiday.dateObj)} day(s) left`}
                  </div>
                </li>
              ))
            ) : (
              <p>No upcoming holidays</p>
            )}
          </ul>
        </div>

        {/* Dynamic Upcoming Birthdays */}
        <div className="info-card">
          <h3 className="heads">🎉 Upcoming Birthdays</h3>
          <ul>
            {upcomingBirthdays.length > 0 ? (
              upcomingBirthdays.map((b, idx) => (
                <li key={idx}>
                  {b.dateObj.toLocaleDateString("en-GB")} -
                  <span className="new">{b.name}</span>
                </li>
              ))
            ) : (
              <p>No upcoming birthdays</p>
            )}
          </ul>
        </div>

        {/* Your Birthday */}
        <div className="info-card">
          <h3 className="heads">🎂 Your Birthday</h3>
          <h4>
            {employeeInfo.dob
              ? parseDOB(employeeInfo.dob).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                })
              : "Not Available"}
          </h4>
          <p>
            🎉 Turning:{" "}
            <span className="new">{getAge(employeeInfo.dob) + 1} years</span>
          </p>
          <p>
            📅 Days Left:{" "}
            <span className="new">
              {getDaysUntilNextBirthday(employeeInfo.dob)} days
            </span>
          </p>
        </div>

        {/* Previous Leaves */}
        <div className="info-card">
          <h3 className="heads">📁 Previous Leave Records</h3>
          <ul>
            {previousLeaves.map((leave, index) => (
              <li key={index}>
                {new Date(leave.date).toLocaleDateString("en-GB")} -
                <span className="new">{leave.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Infocards;
