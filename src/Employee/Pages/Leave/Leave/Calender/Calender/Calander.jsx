import React, { useState, useEffect } from "react";
import "./Calender.css";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { MdOutlinePendingActions } from "react-icons/md";

const indianHolidays = [
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-01-26", name: "Republic Day" },
  { date: "2025-03-08", name: "Holi" },
  { date: "2025-04-14", name: "Tamil New Year" },
  { date: "2025-05-01", name: "Labour Day" },
  { date: "2025-08-15", name: "Independence Day" },
  { date: "2025-10-02", name: "Gandhi Jayanti" },
  { date: "2025-11-04", name: "Diwali" },
  { date: "2025-12-25", name: "Christmas Day" },
];

const Calendar = ({ collapsed }) => {
  const [apiLeaves, setApiLeaves] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize time

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const rawFirstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const firstDayOfMonth = (rawFirstDay + 6) % 7; // shift to Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = 42;
  const dates = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dates.push({
      day: daysInPrevMonth - i,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      currentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      day: i,
      date: new Date(year, month, i),
      currentMonth: true,
    });
  }

  let nextMonthDay = 1;
  while (dates.length < totalCells) {
    dates.push({
      day: nextMonthDay,
      date: new Date(year, month + 1, nextMonthDay),
      currentMonth: false,
    });
    nextMonthDay++;
  }

  const formatDate = (dateObj) => {
    const d = new Date(dateObj);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const isHoliday = (dateObj) => {
    const formatted = formatDate(dateObj);
    return indianHolidays.filter((h) => h.date === formatted);
  };

  const isLeaveDay = (dateObj) => {
    const formatted = formatDate(dateObj);
    return apiLeaves.filter((l) => l.date === formatted);
  };

  const expandLeavesToDates = (leaveArray) => {
    let result = [];
    leaveArray.forEach((leave) => {
      const start = new Date(leave.from_date);
      const end = new Date(leave.to_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        result.push({
          date: dateStr,
          status: leave.status,
          leave_type: leave.leave_type,
        });
      }
    });
    return result;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leaves/all"
        );
        const expanded = expandLeavesToDates(response.data);
        setApiLeaves(expanded);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const changeMonth = (direction) => {
    const newMonth = month + direction;
    if (newMonth < 0) {
      setCurrentDate(new Date(year - 1, 11));
    } else if (newMonth > 11) {
      setCurrentDate(new Date(year + 1, 0));
    } else {
      setCurrentDate(new Date(year, newMonth));
    }
  };

  const changeYear = (direction) => {
    setCurrentDate(new Date(year + direction, month));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="selector-container">
          <div className="year-navigation">
            <button onClick={() => changeYear(-1)} className="arrow-button">
              ‹
            </button>
            <span className="current-year">{year}</span>
            <button onClick={() => changeYear(1)} className="arrow-button">
              ›
            </button>
          </div>
          <div className="month-navigation">
            <button onClick={() => changeMonth(-1)} className="arrow-button">
              ‹
            </button>
            <span className="current-month">
              {currentDate.toLocaleString("default", { month: "long" })}
            </span>
            <button onClick={() => changeMonth(1)} className="arrow-button">
              ›
            </button>
          </div>
          <div className="date-input-container">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate)) {
                  setCurrentDate(newDate);
                  setSelectedDate(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div
            key={idx}
            className={`calendar-header-item ${collapsed ? "cdi-col" : ""}`}
          >
            {day}
          </div>
        ))}

        {dates.map((item, idx) => {
          const { day, date, currentMonth } = item;
          const formattedDate = formatDate(date);
          const holiday = isHoliday(date);
          const leaves = isLeaveDay(date);
          const isSelectedDay = selectedDate === formattedDate;
          const adjustedDay = (date.getDay() + 6) % 7; // Mon=0, Sun=6
          const isWeekend = adjustedDay >= 5;
          const isPast = date < today;

          return (
            <Link
              to="/employee/timesheet"
              key={idx}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`calendar-day
                ${!currentMonth ? "dimmed" : ""}
                ${isWeekend ? "weekend" : ""}
                ${currentMonth && holiday.length > 0 ? "holiday" : ""}
                ${
                  currentMonth && leaves.length > 0
                    ? leaves[0].status === "Rejected"
                      ? "rejected-leave"
                      : leaves[0].status === "Pending"
                      ? "pending"
                      : "leave"
                    : ""
                }
                ${isSelectedDay ? "selected-day" : ""}
              `}
              >
                {day ? (
                  isWeekend && currentMonth ? (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="weekoff-label">WO</div>
                    </>
                  ) : currentMonth && leaves.length > 0 ? (
                    <div className="leave-content">
                      <div className="day-number">{day}</div>
                      <div className="holiday-label">
                        {leaves[0].leave_type.includes("Casual") && <p>CLR</p>}
                        {leaves[0].leave_type.includes("Permission") && (
                          <p>PRR</p>
                        )}
                        {leaves[0].leave_type.includes("Sick") && <p>SLR</p>}
                        {leaves[0].status === "Rejected" ? (
                          <FaTimesCircle
                            style={{ fontSize: "1rem", color: "red" }}
                          />
                        ) : leaves[0].status === "Pending" ? (
                          <MdOutlinePendingActions
                            style={{ fontSize: "1rem", color: "#d5ba66" }}
                          />
                        ) : (
                          <FaCheckCircle
                            style={{ fontSize: "1rem", color: "green" }}
                          />
                        )}
                      </div>
                    </div>
                  ) : currentMonth &&
                    isPast &&
                    (!leaves.length || leaves[0].status === "Rejected") &&
                    holiday.length === 0 ? (
                    <div className="present-day">
                      <div className="day-number">{day}</div>
                      <div className="present-label">P</div>
                    </div>
                  ) : currentMonth && holiday.length > 0 ? (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="holiday-label">{holiday[0].name}</div>
                    </>
                  ) : (
                    <div className="day-number">{day}</div>
                  )
                ) : (
                  <div className="day-number empty"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
