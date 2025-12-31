import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Timesheet.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from 'axios';
 
const Timesheet = ({ filters, setFilters, onSearch }) => {
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const id = routeParamId || routeStateId || storedId;
  const empId = routeParamId || routeStateId || storedId;
  const [project, setProject] = useState([]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
 
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [, setRemainingTime] = useState(8 * 60);
  const [, setLeave] = useState([]);
  const [, setEmployeeInfo] = useState({
    id: '',
    name: '',
    dob: ''
  });
 
  useEffect(() => {
    const getProject = async () => {
      const response = await axios.get("http://localhost:8080/api/projects");
      setProject(response.data);
    };
    getProject();
  }, []);
 
  const formatDisplayDate = (isoDate) => {
    const date = new Date(isoDate);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
 
  useEffect(() => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const dayStr = today.toLocaleDateString('en-IN', { weekday: 'long' });
    setCurrentDate(dateStr);
    setCurrentDay(dayStr);
  }, []);
 
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLoginDate = localStorage.getItem("loginDate");
    let loginTimeStr = localStorage.getItem("loginTime");
 
    if (!loginTimeStr || storedLoginDate !== today) {
      const now = new Date();
      loginTimeStr = now.toISOString();
      localStorage.setItem("loginTime", loginTimeStr);
      localStorage.setItem("loginDate", today);
    }
 
    const loginTime = new Date(loginTimeStr);
 
    const updateRemainingTime = () => {
      const now = new Date();
      const elapsedMs = now - loginTime;
      const elapsedMins = elapsedMs / (1000 * 60);
      const remainingMins = Math.max(8 * 60 - elapsedMins, 0);
      setRemainingTime(remainingMins);
    };
 
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, []);
 
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
 
  // ⬇️ New Code: Previous Week Range Calculation
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  const prevMondayStr = prevMonday.toISOString().split("T")[0];
 
  const prevSunday = new Date(monday);
  prevSunday.setDate(monday.getDate() - 1);
 
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLoginDate = localStorage.getItem("loginDate");
    if (storedLoginDate !== today) {
      localStorage.removeItem("loginTime");
      localStorage.setItem("loginDate", today);
    }
  }, []);
 
  useEffect(() => {
    const fetchleaves = async () => {
      try {
        const leaveres = await axios.get(`http://localhost:8080/api/leaves/employee/${empId}`);
        setLeave(leaveres.data);
      } catch (err) {
        console.log("error fetching leavedata" + err);
      }
    };
    fetchleaves();
  }, [empId]);
 
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/employees/employee/${id}`)
        .then(res => res.json())
        .then(data => {
          setEmployeeInfo({
            id: data.empId,
            name: data.employeeName,
            dob: data.dateOfBirth
          });
          setFilters(prev => ({ ...prev, employee: data.employee }));
        })
        .catch(err => console.error("Failed to fetch employee info", err));
    }
  }, [id, setFilters]);
 
 
  return (
    <div className='overall'>
      <div className="timesheet-container">
        <header className="timesheet-header">
          <h1>Timesheet Management</h1>
        </header>
 
        <div className="today-info">
          <h2>Date: {currentDate}, Day: {currentDay}</h2>
        </div>
 
        <div className="filter-grid">
          <div className="filter-item">
            <label>From Date:</label>
            <div className="date-wrapper">
              <input
                type="text"
                readOnly
                value={filters.fromDate ? formatDisplayDate(filters.fromDate) : ''}
                placeholder="dd-mm-yyyy"
                onClick={() => document.getElementById("fromDatePicker").showPicker()}
              />
              <FaRegCalendarAlt
                className="calendar-icon"
                onClick={() => document.getElementById("fromDatePicker").showPicker()}
              />
            <input
  type="date"
  id="fromDatePicker"
  name="fromDate"
  value={filters.fromDate}
  onChange={handleChange}
  min={prevMondayStr}
  className="hidden-date-input"
/>
 
            </div>
          </div>
 
          <div className="filter-item">
            <label>To Date:</label>
            <div className="date-wrapper">
              <input
                type="text"
                readOnly
                value={filters.toDate ? formatDisplayDate(filters.toDate) : ''}
                placeholder="dd-mm-yyyy"
                onClick={() => document.getElementById("toDatePicker").showPicker()}
              />
              <FaRegCalendarAlt
                className="calendar-icon"
                onClick={() => document.getElementById("toDatePicker").showPicker()}
              />
            <input
  type="date"
  id="toDatePicker"
  name="toDate"
  value={filters.toDate}
  onChange={handleChange}
  min={prevMondayStr}
  className="hidden-date-input"
/>
 
            </div>
          </div>
 
          <div className="filter-item">
            <label>Project Name:</label>
            <select name="project" value={filters.taskList} onChange={handleChange}>
              <option value="ALL">-----ALL-----</option>
              {project.map((p, idx) => (
                <option key={idx} value={p.taskList}>{p.taskList}</option>
              ))}
            </select>
          </div>
 
          <div className="filter-item">
            <label>Timesheet Status:</label>
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="ALL">-----ALL-----</option>
              <option value="Approved">Approved</option>
              <option value="Reverted">Reverted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
 
          <div className="filter-footer">
            <button onClick={onSearch} className="search-button">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Timesheet;