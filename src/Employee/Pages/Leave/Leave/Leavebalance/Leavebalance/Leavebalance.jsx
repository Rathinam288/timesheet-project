import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leavebalance.css";
import { useLocation, useParams } from "react-router-dom";

const LeaveBalance = () => {
  const [data, setData] = useState([]);
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;
  const storedId = localStorage.getItem("employeeId");
  const empId = routeParamId || routeStateId || storedId;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/leaves/record/${empId}`
        );
        setData(response.data);
      } catch (err) {
        console.log("Error fetching leave data:", err);
      }
    };
    getData();
  }, [empId]);

  return (
    <div className="lb-container">
      <h2 className="lb-title">Leave Balance Summary</h2>
      <div className="lb-table-wrapper">
        <table className="lb-table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Taken</th>
              <th>Remaining</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Casual Leave (CLR)📆</td>
              <td>{data.total_casual_leave - data.rem_casual_leave}</td>
              <td>{data.rem_casual_leave}</td>
              <td>{data.total_casual_leave}</td>
            </tr>
            <tr>
              <td>Sick Leave (SLR)📆</td>
              <td>{data.total_sick_leave - data.rem_sick_leave}</td>
              <td>{data.rem_sick_leave}</td>
              <td>{data.total_sick_leave}</td>
            </tr>
            <tr>
              <td>Permission Leave (PRR)⌛</td>
              <td>{data.total_permission - data.rem_permission}</td>
              <td>{data.rem_permission}</td>
              <td>{data.total_permission}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalance;
