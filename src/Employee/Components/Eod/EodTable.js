import React, { useEffect, useState } from "react";
import "./EodTable.css";
import { Link } from "react-router-dom";

const EodTable = () => {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("eodTasks");
    if (stored) {
      setTaskData(JSON.parse(stored));
    }
  }, []);

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="eod-container">
      <div className="eod-header">
        <h2>Employee Task Log</h2>
        <Link to="/employee/eod">
          <button className="add-button">+</button>
        </Link>
      </div>

      <table className="eod-table">
        <thead>
          <tr>
            <th className='head'>Date</th>
            <th className='head'>Day</th>
            <th className='head'>Hours Worked</th>
            <th className='head'>Work</th>
          </tr>
        </thead>
        <tbody>
          {taskData.map((task, index) => (
            <tr key={index}>
              <td>{formatDate(task.date)}</td>
              <td>{task.day || "-"}</td>
              <td>{task.hoursWorked}</td>
              <td>{task.work}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EodTable;
