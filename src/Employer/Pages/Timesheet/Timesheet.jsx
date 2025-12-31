import React, { useState, useMemo, useEffect } from "react";
import "./Timesheet.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import Logo from "../../assets/SORIM_logo_4.png";

const Timesheet = () => {
  const [, setAllEmployees] = useState([]);
  const [, setAllProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employee, setEmployee] = useState("All employees");
  const [project, setProject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [statusMap, setStatusMap] = useState(() => {
    const saved = localStorage.getItem("statusMap");
    return saved ? JSON.parse(saved) : {};
  });

  const [submittedRows, setSubmittedRows] = useState(() => {
    const saved = localStorage.getItem("submittedRows");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [entries, setEntries] = useState([]);

  const itemsPerPage = 5;
  const buttonsPerGroup = 5;

  const currentDateObj = new Date();
  const currentDate = currentDateObj.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentDay = currentDateObj.toLocaleDateString("en-IN", {
    weekday: "long",
  });

  const [, setAdminName] = useState("");

  useEffect(() => {
    const empId = localStorage.getItem("employeeId");
    if (empId) {
      axios
        .get(`http://localhost:8080/api/employees/employee/${empId}`)
        .then((res) => {
          setAdminName(res.data.employeeName);
        })
        .catch(() => {
          console.error("Failed to fetch admin name");
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, projRes] = await Promise.all([
          axios.get("http://localhost:8080/api/employees"),
          axios.get("http://localhost:8080/api/projects"),
        ]);

        setAllEmployees(empRes.data);
        setAllProjects(projRes.data);
      } catch (err) {
        toast.error("Failed to load employee or project data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/timesheet");

        setEntries(data.map((e) => ({ ...e, name: e.employee })));
      } catch (err) {
        toast.error("Failed to fetch timesheet data");
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem("statusMap", JSON.stringify(statusMap));
  }, [statusMap]);

  useEffect(() => {
    localStorage.setItem("submittedRows", JSON.stringify([...submittedRows]));
  }, [submittedRows]);

  const availableProjects = useMemo(() => {
    const list =
      employee !== "All employees"
        ? entries.filter((e) => e.name === employee)
        : entries;
    return [...new Set(list.map((e) => e.project))];
  }, [entries, employee]);

  const allFilteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const afterFrom = !fromDate || entry.date >= fromDate;
      const beforeTo = !toDate || entry.date <= toDate;
      const byEmp = employee === "All employees" || entry.name === employee;
      const byProj = !project || entry.project === project;

      const entryStatus = entry.status || "Pending";
      const byStatus = statusFilter === "All" || entryStatus === statusFilter;

      return afterFrom && beforeTo && byEmp && byProj && byStatus;
    });
  }, [entries, fromDate, toDate, employee, project, statusFilter]);

  const totalPages = Math.ceil(allFilteredEntries.length / itemsPerPage);
  const paginatedEntries = allFilteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (entry, status) => {
    const key = `${entry.name}_${entry.date}_${entry.task}`;
    const cur = statusMap[key];
    setStatusMap((prev) => ({ ...prev, [key]: cur === status ? "" : status }));
  };
  const handleSubmitStatuses = async () => {
    const statusEntries = Object.entries(statusMap).map(([key, status]) => {
      const [name, date, ...taskParts] = key.split("_");
      const task = taskParts.join("_");
      const entry = allFilteredEntries.find(
        (e) => e.name === name && e.date === date && e.task === task
      );
      return {
        key,
        id: entry.id,
        status,
        taskName: entry.task,
        employeeName: entry.employeeName,
      };
    });

    try {
      await axios.post(
        "http://localhost:8080/api/timesheet/bulk-status",
        statusEntries
      );

      // Show toast ONLY for statuses that are new (not already submitted before)
      statusEntries.forEach(({ key, status, taskName }) => {
        if (!submittedRows.has(key)) {
          if (status === "Approved") {
            toast.success("Timesheet has been approved successfully", {
              className: "toast-approve",
            });
          } else if (status === "Rejected") {
            toast.error("Timesheet has been rejected successfully", {
              className: "toast-reject",
            });
          } else if (status === "Reverted") {
            toast.warning("Timesheet has been reverted successfully", {
              className: "toast-revert",
            });
          }
        }
      });

      // Mark these rows as submitted so they won't trigger notifications again
      setSubmittedRows((prev) => {
        const next = new Set(prev);
        Object.entries(statusMap).forEach(([k, s]) => s && next.add(k));
        return next;
      });

      // Update UI with submitted statuses
      setEntries((prevEntries) =>
        prevEntries.map((entry) => {
          const key = `${entry.name}_${entry.date}_${entry.task}`;
          if (statusMap[key]) {
            return { ...entry, status: statusMap[key] };
          }
          return entry;
        })
      );

      // Clear statusMap for submitted entries
      const newStatusMap = { ...statusMap };
      Object.keys(statusMap).forEach((k) => {
        if (submittedRows.has(k) || newStatusMap[k]) {
          delete newStatusMap[k];
        }
      });
      setStatusMap(newStatusMap);

      localStorage.removeItem("statusMap");
      localStorage.setItem("submittedRows", JSON.stringify([...submittedRows]));
    } catch {
      toast.error("Failed to submit statuses");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = Logo;
    logo.onload = () => {
      doc.addImage(logo, "PNG", 14, 10, 25, 15);
      doc.setFontSize(10);
      doc.text("SORIM Technologies Pvt. Ltd.", 50, 15);
      doc.text(
        "Address: 4, Velayutham St, Puzhuthivakkam, Madipakkam, Chennai, Tamil Nadu 600091",
        50,
        20
      );
      doc.text("Email: info@sorimtech.com | Phone: +91-9876543210", 50, 25);
      doc.line(14, 28, 200, 28);

      doc.setFontSize(18);
      doc.text("Employee Timesheet Report", 105, 40, null, null, "center");

      const now = new Date();
      const downloadDate = now.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const downloadDay = now.toLocaleDateString("en-IN", { weekday: "long" });

      const employeeInfo =
        employee === "All employees"
          ? "All Employees"
          : `Employee: ${employee}`;
      const projectInfo = project ? `Project: ${project}` : "";
      const dateRange = `From: ${fromDate} To: ${toDate}`;

      doc.setFontSize(10);
      doc.text(`Downloaded on: ${downloadDate} (${downloadDay})`, 14, 52);
      doc.text(employeeInfo, 14, 58);
      if (projectInfo) {
        doc.text(projectInfo, 14, 63);
        doc.text(dateRange, 14, 68);
      } else {
        doc.text(dateRange, 14, 63);
      }

      const tableColumn = [
        "S.No",
        "Date",
        "Employee",
        "Project",
        "Task",
        "Duration",
        "Remarks",
      ];
      const tableRows = allFilteredEntries.map((entry, index) => [
        index + 1,
        entry.date,
        entry.employeeId,
        entry.name,
        entry.project,
        entry.task,
        entry.duration,
        entry.remarks,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: projectInfo ? 73 : 68,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [121, 189, 66] },
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        const pageNumberText = `Page ${i} of ${totalPages}`;
        doc.text(pageNumberText, 105, doc.internal.pageSize.height - 10, {
          align: "center",
        });
      }

      doc.save("timesheet_report.pdf");
    };
  };

  const exportToExcel = () => {
    const data = allFilteredEntries.map((entry, index) => ({
      "S.No": index + 1,
      Date: entry.date,
      "Employee ID": entry.employeeId,
      Employee: entry.name,
      Project: entry.project,
      Task: entry.task,
      Duration: entry.duration,
      Remarks: entry.remarks,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "timesheet_report.xlsx");
  };

  const handleNextGroup = () => {
    if ((pageGroup + 1) * buttonsPerGroup < totalPages)
      setPageGroup((pg) => pg + 1);
  };
  const handlePrevGroup = () => {
    if (pageGroup) setPageGroup((pg) => pg - 1);
  };

  const start = pageGroup * buttonsPerGroup;
  const visiblePages = [
    ...Array(Math.min(buttonsPerGroup, totalPages - start)),
  ].map((_, i) => start + i + 1);

  return (
    <div className="overall">
      <div className="timesheet-container">
        <header className="timesheet-header">
          <h1>Employee Timesheet System</h1>
          <div className="export-buttons">
            <button className="export-button" onClick={exportToPDF}>
              Export as PDF
            </button>
            <button className="export-button" onClick={exportToExcel}>
              Export as Excel
            </button>
          </div>
        </header>

        <div className="today-info">
          <h2>
            Date: {currentDate}, Day: {currentDay}
          </h2>
        </div>

        <div className="filter-grid">
          <div className="filter-item">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label>Employee:</label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option>All employees</option>
              {[...new Set(entries.map((e) => e.name))].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label>Project:</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {availableProjects.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-item">
          <label>Status:</label>
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Reverted">Reverted</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="table-actions">
          <button
            className="approve-all-btn"
            onClick={() => {
              const upd = { ...statusMap };
              paginatedEntries.forEach((e) => {
                upd[`${e.name}_${e.date}_${e.task}`] = "Approved";
              });
              setStatusMap(upd);
            }}
          >
            Approve All
          </button>
        </div>

        <div className="table-section">
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>S/No</th>
                <th>Approve</th>
                <th>Revert</th>
                <th>Reject</th>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Employee</th>
                <th>Project</th>
                <th>Task</th>
                <th>Duration</th>
                <th>Remarks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {statusFilter === "Rejected"
                      ? "No Records Found"
                      : statusFilter === "Approved"
                      ? "No Records Found"
                      : statusFilter === "Reverted"
                      ? "No Records Found"
                      : statusFilter === "Pending"
                      ? "No Records Found"
                      : "No Records Found"}
                  </td>
                </tr>
              ) : (
                paginatedEntries.map((e, i) => {
                  const k = `${e.name}_${e.date}_${e.task}`;
                  const st = statusMap[k] || "";
                  return (
                    <tr
                      key={k}
                      className={submittedRows.has(k) ? "blur-row" : ""}
                    >
                      <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      {["Approved", "Reverted", "Rejected"].map((flag) => (
                        <td key={flag}>
                          <label
                            className={`custom-checkbox ${
                              st === "Approved"
                                ? "green"
                                : st === "Reverted"
                                ? "yellow"
                                : st === "Rejected"
                                ? "red"
                                : "gray"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={st === flag}
                              onChange={() => handleStatusChange(e, flag)}
                              disabled={submittedRows.has(k)}
                            />
                            <span></span>
                          </label>
                        </td>
                      ))}
                      <td>{e.date}</td>
                      <td>{e.employeeId}</td>
                      <td>{e.name}</td>
                      <td>{e.project}</td>
                      <td>{e.task}</td>
                      <td>{e.duration}</td>
                      <td>{e.remarks}</td>
                      <td>{e.status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={handlePrevGroup} disabled={!pageGroup}>
            {"<"}
          </button>
          {visiblePages.map((p) => (
            <button
              key={p}
              className={currentPage === p ? "active" : ""}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleNextGroup}
            disabled={(pageGroup + 1) * buttonsPerGroup >= totalPages}
          >
            {">"}
          </button>
        </div>

        <div className="submit-button-container">
          <button className="submit-button" onClick={handleSubmitStatuses}>
            Submit
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
};

export default Timesheet;
