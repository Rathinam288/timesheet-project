import React, { useEffect, useState } from "react";
import "./Leaverecord.css";
import axios from "axios";

function Leaverecord() {
  const [data, setData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leaves/all"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: " + error);
      }
    };
    getData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "lightgreen";
      case "Pending":
        return "lightyellow";
      case "Rejected":
        return "lightcoral";
      default:
        return "white";
    }
  };

  const filteredData = data.filter((d) => {
    return filteredStatus === "All" || d.status === filteredStatus;
  });

  return (
    <div className="Appleav">
      <h2 className="leave1">Leave Record</h2>

      <ul className="settingsnav">
        <li>
          <div className="sett" onClick={() => setFilteredStatus("All")}>
            All
          </div>
        </li>
        <li>
          <div className="sett" onClick={() => setFilteredStatus("Approved")}>
            Approved
          </div>
        </li>
        <li>
          <div className="sett" onClick={() => setFilteredStatus("Pending")}>
            Pending
          </div>
        </li>
        <li>
          <div className="sett" onClick={() => setFilteredStatus("Rejected")}>
            Rejected
          </div>
        </li>
      </ul>

      <div className="App1">
        <table>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, index) => (
              <tr
                key={index}
                style={{ backgroundColor: getStatusColor(d.status) }}
              >
                <td>{d.leave_type}</td>
                <td>{d.from_date}</td>
                <td>{d.to_date}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaverecord;
