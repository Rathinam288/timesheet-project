import React, { useState, useEffect } from "react";
import "./EodMainPage.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const DUMMY_EMPLOYEE = {
  id: "EMP003",
  name: "Tamil Selvan",
};

const EodMainPage = () => {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    hoursWorked: "",
    work: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("eodTasks");
    if (storedData) {
      setTaskData(JSON.parse(storedData));
    }
  }, []);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const selectedDate = new Date(value);
      const dayName = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      setFormData((prev) => ({
        ...prev,
        date: value,
        day: dayName,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { date, day, hoursWorked, work } = formData;

    if (date && day && hoursWorked && work) {
      const newTask = { date, day, hoursWorked, work };

      let updatedTasks;
      if (editIndex !== null) {
        updatedTasks = [...taskData];
        updatedTasks[editIndex] = newTask;
        setEditIndex(null);
      } else {
        updatedTasks = [newTask, ...taskData];
      }

      setTaskData(updatedTasks);
      localStorage.setItem("eodTasks", JSON.stringify(updatedTasks));
      setFormData({ date: "", day: "", hoursWorked: "", work: "" });
      setShowForm(false);
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleEdit = (index) => {
    const task = taskData[index];
    setFormData(task);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedTasks = taskData.filter((_, i) => i !== index);
    setTaskData(updatedTasks);
    localStorage.setItem("eodTasks", JSON.stringify(updatedTasks));
  };

const exportToPDF = () => {
  const doc = new jsPDF();
  const now = new Date();
  const exportDate = formatDate(now.toISOString().split("T")[0]);
  const exportDay = now.toLocaleDateString("en-US", { weekday: "long" });

  // Center title
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleText = "Employee EOD Report";
  const textWidth = doc.getTextWidth(titleText);
  const centerX = (pageWidth - textWidth) / 2;
  doc.text(titleText, centerX, 16);

  // Add employee info
  doc.text(`Employee ID: ${DUMMY_EMPLOYEE.id}`, 14, 24);
  doc.text(`Employee Name: ${DUMMY_EMPLOYEE.name}`, 14, 32);
  doc.text(`Report Date: ${exportDate} (${exportDay})`, 14, 40);

  autoTable(doc, {
    startY: 48,
    head: [["Date", "Day", "Hours Worked", "Work"]],
    body: taskData.map((task) => [
      formatDate(task.date),
      task.day,
      task.hoursWorked,
      task.work,
    ]),
  });

  doc.save("EOD_Report.pdf");
};


  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="eod-container">
      <div className="header-bar">
        <h2>Employee EOD Entries</h2>
        <button className="add-button" onClick={() => {
          setFormData({ date: "", day: "", hoursWorked: "", work: "" });
          setEditIndex(null);
          setShowForm(!showForm);
        }}>
          {showForm ? "Close" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form className="eod-form" onSubmit={handleSubmit}>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          <input type="text" name="day" placeholder="Day" value={formData.day} onChange={handleInputChange} required />
          <input className="hour" type="text" name="hoursWorked" placeholder="Hours Worked" value={formData.hoursWorked} onChange={handleInputChange} required />
          <input className="work" type="text" name="work" placeholder="Work Description" value={formData.work} onChange={handleInputChange} required />
          <button type="submit" className="submit-button">{editIndex !== null ? "Update" : "Submit"}</button>
        </form>
      )}

      <table className="eod-table">
        <thead>
          <tr>
            <th className='head'>Date</th>
            <th className='head'>Day</th>
            <th className='head'>Hours Worked</th>
            <th className='head'>Work</th>
            <th className='head'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taskData.map((task, index) => (
            <tr key={index}>
              <td>{formatDate(task.date)}</td>
              <td>{task.day}</td>
              <td>{task.hoursWorked}</td>
              <td>{task.work}</td>
              <td>
                <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-group">
        <button onClick={exportToPDF} className="export-button">Export PDF</button>
        <button onClick={handleFinish} className="finish-button">Finish</button>
      </div>
    </div>
  );
};

export default EodMainPage;