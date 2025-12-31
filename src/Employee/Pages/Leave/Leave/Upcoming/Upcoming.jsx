import React from "react";
import "./Upcoming.css";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

function Leave() {
  const [data, setData] = useState([]);
  const [delalert, setdelalert] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // 🔄 IDs
  // const [leaveRecordId, setLeaveRecordId] = useState(null);
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const empId = routeParamId || routeStateId || storedId;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/leaves/employee/${empId}`
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.log("Error fetching leave data:", err);
      }
    };
    getData();
  }, [empId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/leaves/delete/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      setFilteredData((prev) => prev.filter((item) => item.id !== id));
      setdelalert(null);
    } catch (err) {
      console.log("Error deleting leave request:", err);
    }
  };

  const navigate = useNavigate();

  const handleeditClick = (id) => {
    navigate(`/employee/Leavedetails/edit/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const listApproved = () => {
    const app = data.filter((d) => d.status === "Approved");
    setFilteredData(app);
  };

  const listPending = () => {
    const pen = data.filter((d) => d.status === "Pending");
    setFilteredData(pen);
  };

  const listRejected = () => {
    const rej = data.filter((d) => d.status === "Rejected");
    setFilteredData(rej);
  };

  const latestSort = () => {
    const sorted = [...filteredData].sort(
      (a, b) => new Date(b.from_date) - new Date(a.from_date)
    );
    setFilteredData(sorted);
  };

  const oldestSort = () => {
    const sorted = [...filteredData].sort(
      (a, b) => new Date(a.from_date) - new Date(b.from_date)
    );
    setFilteredData(sorted);
  };

  return (
    <>
      <div className="upcom1">
        <div className="statu">
          <div id="leave-heading">
            <h2 className="sttext">Leave Record</h2>
            <div className="filter-icon">
              {/* Filter by Status */}
              <div className="select-wrapper">
                {/* <IoFilter className="select-icon" /> */}
                <select
                  className="custom-dropdown"
                  onChange={(e) => {
                    if (e.target.value === "Approved") listApproved();
                    else if (e.target.value === "Pending") listPending();
                    else if (e.target.value === "Rejected") listRejected();
                    else setFilteredData(data);
                  }}
                >
                  <option disabled value="">
                    Filter by Status
                  </option>
                  <option value="All">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <TiArrowSortedDown className="select-arrow" />
              </div>

              {/* Filter by Leave Type */}
              <div className="select-wrapper">
                {/* <IoFilter className="select-icon" /> */}
                <select
                  className="custom-dropdown"
                  onChange={(e) => {
                    if (e.target.value === "CLR") {
                      setFilteredData(
                        data.filter(
                          (d) => d.leave_type === "Casual Leave (CLR)"
                        )
                      );
                    } else if (e.target.value === "SLR") {
                      setFilteredData(
                        data.filter((d) => d.leave_type === "Sick Leave (SLR)")
                      );
                    } else if (e.target.value === "PRR") {
                      setFilteredData(
                        data.filter((d) => d.leave_type === "Permission (PRR)")
                      );
                    } else {
                      setFilteredData(data);
                    }
                  }}
                >
                  <option disabled value="">
                    Filter by Type
                  </option>
                  <option value="All">All</option>
                  <option value="CLR">(CLR)</option>
                  <option value="SLR">(SLR)</option>
                  <option value="PRR">(PRR)</option>
                </select>
                <TiArrowSortedDown className="select-arrow" />
              </div>

              {/* Sort by Date */}
              <div className="select-wrapper">
                {/* <BiSort className="select-icon" /> */}
                <select
                  className="custom-dropdown"
                  onChange={(e) => {
                    if (e.target.value === "Latest") latestSort();
                    else if (e.target.value === "Oldest") oldestSort();
                    else setFilteredData(data);
                  }}
                >
                  <option disabled value="">
                    Sort by Date
                  </option>
                  <option value="Latest">Latest by Date</option>
                  <option value="Oldest">Oldest by Date</option>
                </select>
                <TiArrowSortedDown className="select-arrow" />
              </div>
            </div>
          </div>
          {/* <ul>
        <li className='li'>Approved</li>
        <li className='li'>Pending</li>
        <li className='li'>Rejected</li>
       </ul> */}
          {filteredData.map((res, index) => (
            <>
              {delalert === res.id ? (
                <div id="leave-tab" className="reconfirm">
                  <p>Confirm to Delete Leave Request</p>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="leave-del-but"
                    id="leave-d-b"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setdelalert(null)}
                    className="leave-pending-but leave-del-but"
                    id="leave-e-b"
                  >
                    No
                  </button>
                </div>
              ) : (
                <div
                  id="leave-tab"
                  className={`${
                    res.status === "Approved"
                      ? "leave-approved-tab"
                      : res.status === "Pending"
                      ? "leave-pending-tab"
                      : "leave-rejected-tab"
                  }`}
                >
                  <div className="leave-leave-date">
                    <h4 key={index}>{formatDate(res.from_date)}</h4> -{" "}
                    <h4>{formatDate(res.to_date)}</h4>
                  </div>
                  {res.leave_type === "Permission (PRR)" && (
                    <div className="leave-leave-time">
                      <h4>{res.from_time}</h4> - <h4>{res.to_time}</h4>
                    </div>
                  )}
                  <div id="leave-reason">{res.reason}</div>
                  <div id="leave-d">
                    {(res.leave_type === "Casual Leave (CLR)" && "CLR") ||
                      (res.leave_type === "Sick Leave (SLR)" && "SLR") ||
                      (res.leave_type === "Permission (PRR)" && "PRR")}{" "}
                    - {res.leave_duration}
                  </div>
                  <div className="leave-but">
                    <button
                      className={`leave-del-but ${
                        res.status === "Approved"
                          ? "leave-approved"
                          : res.status === "Pending"
                          ? "leave-pending-but"
                          : ""
                      }`}
                    >
                      {res.status}
                    </button>
                    {res.status === "Pending" && (
                      <>
                        <button
                          className="leave-del-but"
                          id="leave-delete"
                          onClick={() => {
                            setdelalert(res.id);
                          }}
                        >
                          delete
                        </button>
                        <div
                          className="leave-edit"
                          id="ed"
                          onClick={() => {
                            handleeditClick(res.id);
                          }}
                        >
                          <MdModeEditOutline />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default Leave;
