import React, { useState, useEffect } from 'react';
import Timesheet from './Timesheet';
import TimesheetTable from '../TimesheetTable/TimesheetTable';
import './TimesheetMain.css';
import { useParams, useLocation } from 'react-router-dom';

const TimesheetMain = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const stateId = location.state?.id;
  const localStorageId = localStorage.getItem("employeeId");
  const employeeId = paramId || stateId || localStorageId;

  const [employeeInfo, setEmployeeInfo] = useState({
    id: employeeId,
    name: '',
    dob: '',
  });

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    employeeId: employeeId,
    employee: '',
    customer: 'ALL',
    ticket: 'ALL',
    status: 'ALL',
    project: 'ALL',
  });

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch profile info on mount
  useEffect(() => {
    if (employeeId) {
      fetch(`http://localhost:8080/api/employees/${employeeId}`)
        .then((res) => res.json())
        .then((data) => {
          setEmployeeInfo(data);
          setFilters((prev) => ({
            ...prev,
            employee: data.employeeName,
            employeeId: data.empId,
          }));
        })
        .catch((err) => console.error("Error fetching profile info:", err));
    }
  }, [employeeId]);

  // Fetch timesheet data
  useEffect(() => {
    if (employeeId) {
      fetch(`http://localhost:8080/api/timesheet/employee/${employeeId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllData(data);
          setFilteredData(data);
        })
        .catch((err) => console.error("Error fetching timesheet data:", err));
    }
  }, [employeeId]);

  const handleSearch = () => {
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;
    const { project, status } = filters;

    const result = allData.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (from && entryDate < from) return false;
      if (to && entryDate > to) return false;
      if (project !== "ALL" && entry.project !== project) return false;
      if (status !== "ALL" && entry.status !== status) return false;
      return true;
    });

    setFilteredData(result);
  };

  return (
    <div className='timesheet-main'>
      <Timesheet
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        employeeInfo={employeeInfo}
      />
      <TimesheetTable data={filteredData} />
    </div>
  );
};

export default TimesheetMain;
