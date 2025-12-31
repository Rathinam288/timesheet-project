import React, { useState, useEffect } from "react";
import "./Leaverecord.css";
import axios from "axios";

function Leaverecord() {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const statusToColorClass = {
    Approved: "approved",
    Pending: "pending",
    Rejected: "rejected",
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leaves/all"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      }
    };

    getData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/leaves/update-status/${id}`,
        null,
        {
          params: {
            status: newStatus,
          },
        }
      );

      // Update local state after successful status update
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filter data based on selected status
  const filteredData = data.filter((item) => {
    if (filterStatus === "All") return true;
    return item.status?.trim().toLowerCase() === filterStatus.toLowerCase();
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="Appleav">
      <h2 className="leave1">Leave Record</h2>

      <ul className="settingsnav">
        {["All", "Approved", "Pending", "Rejected"].map((status) => (
          <li key={status}>
            <div
              className={`sett ${filterStatus === status ? "active" : ""}`}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1); // reset to first page when filter changes
              }}
            >
              {status}
            </div>
          </li>
        ))}
      </ul>

      <div className="App1">
        <table>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className={statusToColorClass[item.status?.trim()] || ""}
                >
                  <td>{item.emp_id}</td>
                  <td>{item.employeeName}</td>
                  <td>{item.leave_type}</td>
                  <td>{item.from_date}</td>
                  <td>{item.to_date}</td>
                  <td>{item.description || item.reason}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-records">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        {filteredData.length > rowsPerPage && (
          <div className="pagination">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ◀ Prev
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaverecord;
