import React from 'react'
import { FaArrowDown } from "react-icons/fa";
import "./Teamhietable2.css";

function Teamhietable2() {
  const teamData = [
    {
      name: "Sorim",
      designation: "CEO",
      status: "Completed",
    },
    {
      name: "Senthil Palani",
      designation: "Manager",
      status: "Completed",
    },
    {
      name: "Rama",
      designation: "Manager",
      status: "Completed",
    },
    {
      name: "Abinaya",
      designation: "HR",
      status: "Completed",
    },
    {
      name: "Hareesh",
      designation: "Front-End Developer",
      status: "In Progress",
    },{
      name: "Kaviarasi",
      designation: "Back-End Developer",
      status: "In Progress",
    },{
      name: "Ponnusamy",
      designation: "Full Stack Developer",
      status: "In Progress",
    },
  ];
  return (
    <div>
      <div className="hierarchy-container">
      <div className="columns-container">
        <div className="column name-column">
          <div className="cell header">Name</div>
          {teamData.map((member, index) => (
            <div key={index} className="cell">
              {member.name}
              {index < teamData.length - 1 && (
                <div className="arrow-row">
                  <FaArrowDown className="arrow" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="column designation-column">
          <div className="cell header">Designation</div>
          {teamData.map((member, index) => (
            <div key={index} className="cell">
              {member.designation}
              {index < teamData.length - 1 && (
                <div className="arrow-row">
                  <FaArrowDown className="arrow" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="column status-column">
          <div className="cell header">Status</div>
          {teamData.map((member, index) => (
            <div key={index} className="cell">
              {member.status}
              {index < teamData.length - 1 && (
                <div className="arrow-row">
                  <FaArrowDown className="arrow" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Teamhietable2