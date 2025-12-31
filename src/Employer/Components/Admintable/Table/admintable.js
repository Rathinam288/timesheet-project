import React, { useState } from 'react';
import './admintable.css';
import male from '../../../assets/Male.jpeg';
import female from '../../../assets/Female.jpeg';
import NameFilter from '../Name/name.js';
import DateFilter from '../Date/date.js'; 

const employeeData = [
  { id: '001', image: male, name: 'Aakash P', date: '2025-04-22', day: 'Tuesday', inTime: '9:30AM', outTime: '5:30PM', total: '8hrs' },
  { id: '002', image: male, name: 'Afzal R', date: '2025-04-22', day: 'Tuesday', inTime: '10:00AM', outTime: '5:00PM', total: '7hrs' },
  { id: '003', image: female, name: 'Gayathri V', date: '2025-04-02', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
  { id: '004', image: male, name: 'Gnanarathinam', date: '2025-04-22', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
  { id: '005', image: male, name: 'Hareesh', date: '2025-04-04', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
  { id: '006', image: male, name: 'Hari babu', date: '2025-04-22', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
  { id: '007', image: female, name: 'Kaviarasi', date: '2025-04-02', day: 'Tuesday', inTime: '9.00AM', outTime: '6.00PM', total: '9hrs' },
  { id: '008', image: male, name: 'Ponnuchamy V', date: '2025-04-22', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
  { id: '009', image: male, name: 'Tamilselvan', date: '2025-04-22', day: 'Tuesday', inTime: '9.00AM', outTime: '5.30PM', total: '8hrs 30min' },
];

function Admintable() {
  const [searchName, setSearchName] = useState('');  
  const [searchDate, setSearchDate] = useState('');  


  const filteredEmployees = employeeData.filter((emp) => {
    const matchesName = emp.name.toLowerCase().startsWith(searchName.toLowerCase());  
    const matchesDate = emp.date === searchDate || searchDate === '';  
    return matchesName && matchesDate;
  });

  return (
    <div className="bg">
      <div className='namedate'>
   
      <NameFilter searchName={searchName} setSearchName={setSearchName} />
      

      <DateFilter searchDate={searchDate} setSearchDate={setSearchDate} />
      </div>

      <div className="tab">
        <table>
          <thead>
            <tr>
              <th className='thead'>S.NO</th>
              <th className='thead'>EMPLOYEE ID</th>
              <th className='thead'>IMAGE</th>
              <th className='thead'>EMPLOYEE NAME</th>
              <th className='thead'>DATE</th>
              <th className='thead'>DAY</th>
              <th className='thead'>IN-TIME</th>
              <th className='thead'>OUT-TIME</th>
              <th className='thead'>TOTAL-HOURS</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>
                  No matching results.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td className='tdata'>{index + 1}</td>
                  <td className='tdata'>{emp.id}</td>
                  <td className='tdata'><img src={emp.image} alt={emp.name} className='emp-img'/></td>
                  <td className='tdata'>{emp.name}</td>
                  <td className='tdata'>{emp.date}</td>
                  <td className='tdata'>{emp.day}</td>
                  <td className='tdata'>{emp.inTime}</td>
                  <td className='tdata'>{emp.outTime}</td>
                  <td className='tdata'>{emp.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admintable;

