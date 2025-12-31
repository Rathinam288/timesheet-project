import React from 'react';
import './Teamtable.css'; 

const TableContent = () => {
  const tasks = [
    {
      task: "Portfolio",
      status: "In Progress",
      dueDate: "25-Apr-2025"
    },
    {
      task: "Student Form",
      status: "Completed",
      dueDate: "28-Apr-2025"
    },
    {
      task: "Magic Calculator",
      status: "Pending",
      dueDate: "30-Apr-2025"
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "status in-progress";
      case "Completed":
        return "status completed";
      case "Pending":
        return "status pendings";
      default:
        return "status";
    }
  };

  return (
    <div className="table-containerss">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item, index) => (
            <tr key={index}>
              <td>{item.task}</td>
              <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
              <td>{item.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContent;