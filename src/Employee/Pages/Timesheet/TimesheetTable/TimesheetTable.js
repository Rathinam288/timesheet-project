import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TimesheetTable.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import Logo from "../../../assets/office logo.png";
import axios from "axios";
 
 
const TimesheetTable = ({ filters, setFilters, data }) => {
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const id = routeParamId || routeStateId || storedId;
  const [timesheetData, setTimesheetData] = useState(data || []);
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
  };
  const fromDate = timesheetData.length > 0 ? timesheetData[0].date : "";
const toDate = timesheetData.length > 0 ? timesheetData[timesheetData.length - 1].date : "";
const downloadDate = formatDate(new Date());
  const [profile, setProfile] = useState({
    employeeId: "",
    employee: "",
    dob: "",
    email: "",
  });
  useEffect(() => {
    setTimesheetData(data || []);
  }, [data]);
 
 
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    date: "",
    employeeId: "",
    employee: "",
    project: "",
    task: "",
    duration: "",
    remarks: "",
  });
  const [project,setProject] = useState([]);
 
  useEffect(()=>{
      const getProject = async() =>{
      const response = await axios.get("http://localhost:8080/api/projects")
      setProject(response.data);
      console.log(response.data);
      }
      getProject();
    },[]);
 
// ✅ Calculate Monday (start of this week)
const today = new Date();
const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ...
const monday = new Date(today);
monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
const mondayStr = monday.toISOString().split("T")[0];

// ✅ Calculate Sunday (end of this week)
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);
const sundayStr = sunday.toISOString().split("T")[0];

// ✅ Restrict max date to "today" (so tomorrow/future not allowed)
const todayStr = today.toISOString().split("T")[0];
const maxAllowedDate = todayStr < sundayStr ? todayStr : sundayStr;
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  // Fetch Profile Details
  useEffect(() => {
 
    if (id) {
      fetch(`http://localhost:8080/api/employees/employee/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.id);
          setProfile({
            employeeId: data.empId,
            employee: data.employeeName,
            dob: data.dateOfBirth,
            email: data.email,
          });
          // Also pre-fill the employee fields for new entry
          setNewEntry((prev) => ({
            ...prev,
            employeeId: data.empId,
            employee: data.employeeName,
          }));
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [id]);
 
  // Fetch Timesheet Entries
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
const fetchData = () => {
  fetch(`http://localhost:8080/api/timesheet/employee/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const sortedData = data.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("-").map(Number);
        const [dayB, monthB, yearB] = b.date.split("-").map(Number);
        return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
      });
      setTimesheetData(sortedData);
      setCurrentPage(1);
    })
    .catch((err) => console.error("Error fetching timesheet data:", err));
};

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = timesheetData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(timesheetData.length / itemsPerPage);
 
  // Delete Entry
  const handleDelete = (entryId) => {
  fetch(`http://localhost:8080/api/timesheet/${entryId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      setTimesheetData((prev) => prev.filter((e) => e.id !== entryId));

      // ✅ Toast
      toast.success("Timesheet deleted successfully!");
    })
    .catch((err) => {
      console.error("Delete error:", err);
      toast.error("Failed to delete timesheet");
    });
};

 
  // Open Edit Modal
  const handleEditClick = (entry) => {
    setSelectedEntry({ ...entry });
    setShowModal(true);
  };
 
 
 
  // Handle changes in Edit Modal
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntry((prev) => ({ ...prev, [name]: value }));
  };
 
  // Save Edited Entry
 const handleSave = () => {
  fetch(`http://localhost:8080/api/timesheet/${selectedEntry.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedEntry),
  })
    .then((res) => res.json())
    .then((updated) => {
      const updatedData = timesheetData.map((entry) =>
        entry.id === updated.id ? updated : entry
      );
      setTimesheetData(updatedData);
      setShowModal(false);

      // ✅ Toast
      toast.success("Timesheet updated successfully!");
    })
    .catch((err) => {
      console.error("Update error:", err);
      toast.error("Failed to update timesheet");
    });
};

  // Handle changes in Add Modal
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };
 
  // Save New Entry
const handleAddSave = () => {
  const requiredFields = ["date", "project", "task", "duration", "remarks"];

  for (let field of requiredFields) {
    if (!newEntry[field] || newEntry[field].trim() === "") {
      alert(`Please fill the ${field}`);
      return;
    }
  }

  const entryToAdd = {
    ...newEntry,
    employeeId: profile.employeeId,
    employee: profile.employee,
    status: "Pending",
  };

  fetch("http://localhost:8080/api/timesheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entryToAdd),
  })
    .then((res) => res.json())
    .then((added) => {
  setTimesheetData((prev) => [added, ...prev]);
      setShowAddModal(false);
      setNewEntry({
        date: "",
        employeeId: profile.employeeId,
        employee: profile.employee,
        project: "",
        task: "",
        duration: "",
        remarks: "",
      });

      // ✅ Toast
      toast.success("Timesheet added successfully!");
    })
    .catch((err) => {
      console.error("Add error:", err);
      toast.error("Failed to add timesheet");
    });
};

 
const exportExcel = () => {
  // ✅ Metadata rows with company name & address
  const metaData = [
    { A: "Company Name:", B: "SORIM Technologies Pvt. Ltd." },
    {
      A: "Company Location:",
      B: "Olympia Platina 9th Floor South Phase, Guindy, Chennai, Tamil Nadu, 600032, India",
    },
    {}, // blank row after company info
    { A: "Employee Name:", B: profile.employee || "N/A" },
    { A: "Employee ID:", B: profile.employeeId || "N/A" },
    { A: "From Date:", B: filters?.fromDate || "N/A" },
    { A: "To Date:", B: filters?.toDate || "N/A" },
    { A: "Date of Download:", B: new Date().toLocaleDateString() },
    {}, // blank row before table
  ];

  // ✅ Timesheet table rows
  const timesheetRows = timesheetData.map((i) => ({
    Date: i.date,
    Project: i.project,
    Task: i.task,
    Duration: i.duration,
    Remarks: i.remarks,
    Status: i.status,
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(metaData, { skipHeader: true });
  XLSX.utils.sheet_add_json(ws, timesheetRows, { origin: -1 });

  // ✅ Apply styling
  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let R = 0; R <= range.e.r; ++R) {
    for (let C = 0; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = ws[cell_ref];

      if (!cell) continue;

      // Company name & address (first two rows)
      if (C === 0 && R < 2) {
        cell.s = {
          font: { bold: true, sz: 14 }, // slightly bigger font
        };
      }

      // Metadata labels (Column A after company info)
      if (C === 0 && R >= 3 && R < 8) {
        cell.s = {
          font: { bold: true },
        };
      }

      // Timesheet header row (first row after blank line)
      if (R === 9) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } }, // blue background
        };
      }
    }
  }

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Timesheet");

  // Save file
  XLSX.writeFile(wb, `Timesheet_${profile.employee}.xlsx`);
};

 
 const exportPDF = () => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = Logo;

  const formattedFromDate = fromDate ? formatDate(fromDate) : "-";
  const formattedToDate = toDate ? formatDate(toDate) : "-";

  img.onload = () => {
    doc.addImage(img, "WEBP", 14, 10, 30, 15);
    doc.setFontSize(10);
    doc.text("SORIM Technologies Pvt. Ltd.", 50, 15);
    doc.text(
      "Address: Olympia Platina 9th Floor South Phase, Guindy, Chennai, Tamil Nadu, 600032, India",
      50,
      20
    );
    doc.text("Email: admin@sorimtechnologies.com", 50, 25);
    doc.line(14, 28, 200, 28);

    doc.setFontSize(16);
    doc.text("Timesheet", 105, 40, null, null, "center");

    doc.setFontSize(11);
    doc.text(`Employee ID: ${profile.employeeId}`, 14, 50);
    doc.text(`Employee Name: ${profile.employee}`, 14, 56);
    doc.text(`From Date: ${formattedFromDate}`, 14, 62);
    doc.text(`To Date: ${formattedToDate}`, 100, 62);
    doc.text(`Downloaded On: ${downloadDate}`, 14, 68);

    autoTable(doc, {
      startY: 80,
      head: [["Date", "Project", "Task", "Duration", "Remarks", "Status"]],
      body: timesheetData.map((item) => [
        item.date,
        item.project,
        item.task,
        item.duration,
        item.remarks,
        item.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 59, 120] },
    });

    doc.save(`Timesheet_${profile.employee}.pdf`);
  };
};

  return (
    <div className="table-container">
      <button className="add" onClick={() => setShowAddModal(true)}>
        + Add Entry
      </button>
 
      <table className="timesheet-table">
        <thead>
          <tr>
            <th>S/No</th>
            <th>Approve</th>
            <th>Revert</th>
            <th>Reject</th>
            <th>Date</th>
            <th>Project</th>
            <th>Task</th>
            <th>Duration</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((e, idx) => (
            <tr key={e.id}>
              <td>{indexOfFirst + idx + 1}</td>
              <td>
              <label className={`custom-checkbox ${e.status === 'Approved' ? 'green' : ''}`}>
                <input type="checkbox" checked={e.status === 'Approved'} disabled />
                <span></span>
              </label>
            </td>
            <td>
              <label className={`custom-checkbox ${e.status === 'Reverted' ? 'yellow' : ''}`}>
                <input type="checkbox" checked={e.status === 'Reverted'} disabled />
                <span></span>
              </label>
            </td>
            <td>
              <label className={`custom-checkbox ${e.status === 'Rejected' ? 'red' : ''}`}>
                <input type="checkbox" checked={e.status === 'Rejected'} disabled />
                <span></span>
              </label>
            </td>
              <td>{formatDate(e.date)}</td>
              <td>{e.project}</td>
              <td>{e.task}</td>
              <td>{e.duration}</td>
              <td>{e.remarks}</td>
              <td>{e.status}</td>
            <td>
  <FaEdit
    color={e.status === "Pending" ? "#213B78" : "gray"}
    style={{
      cursor: e.status === "Pending" ? "pointer" : "not-allowed",
      marginRight: "10px",
      opacity: e.status === "Pending" ? 1 : 0.5,
    }}
    onClick={() => {
      if (e.status === "Pending") handleEditClick(e);
    }}
  />
  <FaTrash
    style={{
      cursor: e.status === "Pending" ? "pointer" : "not-allowed",
      color: e.status === "Pending" ? "red" : "gray",
      opacity: e.status === "Pending" ? 1 : 0.5,
    }}
    onClick={() => {
      if (e.status === "Pending") handleDelete(e.id);
    }}
  />
</td>
 
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No timesheet entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
 
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
 
      {/* Export Buttons */}
      <div className="export-button-container">
        <button className="pdf" onClick={exportPDF}>
          Export PDF
        </button>
        <button className="excel" onClick={exportExcel}>
          Export Excel
        </button>
      </div>
 
      {/* Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Entry</h3>
<label>Date<span className="span-timesheet">*</span></label>
<div className="date-wrapper">

<input
  type="date"
  id="editDatePicker"
  name="date"
  value={selectedEntry.date}
  onChange={handleModalChange}
  min={mondayStr}
  max={maxAllowedDate}
/>

</div>
 
 <label>Project<span className="span-timesheet">*</span></label>
<select
  name="project"
  value={selectedEntry.project}
  onChange={handleModalChange}
  required
>
  <option value="">-- Select Project --</option>
  {project.map((p, idx) => (
    <option key={idx} value={p.taskList}>{p.taskList}</option>
  ))}
</select>

            <label>Task<span className="span-timesheet">*</span></label>
            <input
              type="text"
              name="task"
              value={selectedEntry.task}
              onChange={handleModalChange}
              required
            />
            <label>Duration<span className="span-timesheet">*</span></label>
            <input
              type="text"
              name="duration"
              value={selectedEntry.duration}
              onChange={handleModalChange}
              required
            />
            <label>Remarks<span className="span-timesheet">*</span></label>
            <textarea
              name="remarks"
              value={selectedEntry.remarks}
              onChange={handleModalChange}
              required
            />
            <div className="modal-buttons">
              <button onClick={handleSave} className="save">
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancelll"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add New Entry</h3>
<label>Date<span className="span-timesheet">*</span></label>
<div className="date-wrapper">

<input
  type="date"
  id="addDatePicker"
  name="date"
  value={newEntry.date}
  onChange={handleAddChange}
  min={mondayStr}          // ✅ only from this week Monday
  max={maxAllowedDate}     // ✅ only till today (not tomorrow/future)
/>

</div>
            
 <label>Project<span className="span-timesheet">*</span></label>
<select
  name="project"
  value={newEntry.project}
  onChange={handleAddChange}
  required
>
  <option value="">-- Select Project --</option>
  {project.map((p, idx) => (
    <option key={idx} value={p.taskList}>{p.taskList}</option>
  ))}
</select>

            <label>Task<span className="span-timesheet">*</span></label>
            <input
              type="text"
              name="task"
              value={newEntry.task}
              onChange={handleAddChange}
              required
            />
            <label>Duration<span className="span-timesheet">*</span></label>
            <input
              type="text"
              name="duration"
              value={newEntry.duration}
              onChange={handleAddChange}
              required
            />
            <label>Remarks<span className="span-timesheet">*</span></label>
            <textarea
              name="remarks"
              value={newEntry.remarks}
              onChange={handleAddChange}
              required
            />
            <div className="modal-buttons">
              <button onClick={handleAddSave} className="save">
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="cancelll"
              >
                Cancel
              </button>
            </div>
         

          </div>
        </div>
        
      )}
         <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
    
  );
};
 
export default TimesheetTable;
 
 