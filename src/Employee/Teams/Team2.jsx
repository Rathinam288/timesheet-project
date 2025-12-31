import React from "react";
import { useNavigate } from "react-router-dom";
import "./Team.css";

const Team2 = () => {
  const navigate = useNavigate();

  const staticTeams = [
   {
      Id: "T002",
      CEO: "Benjamin Lee",
      HR_Manager: "Linda Wright",
      Client_Name: "xxxxxx.",
      Team_Name: "Beta Team",
      Team_Manager: "Amanda",
      Team_Leader: "Charlie",
      Team_senior: "Bob",
      Team_Member: [
        { name: "Mira", designation: "UI Designer", attendance: "Present" },
        { name: "Steve", designation: "QA Analyst", attendance: "Absent" },
        { name: "Raj", designation: "React Developer", attendance: "Present" }
      ],
      Project_Name: "Student Form",
      Start_Date: "2024-02-01",
      End_Date: "2024-07-31",
      Status: "Completed",
    },
  ];

  const handleCardDoubleClick = (team) => {
    navigate(`/team/${team.Id}`, { state: { team } });
  };

  return (
    <div className="kteam-container">
      <h2>Team Details</h2>
      <div className="card-view">
        {staticTeams.map((item, index) => (
          <div
            key={index}
            className="team-card-full"
            onDoubleClick={() => handleCardDoubleClick(item)}
          >           
            <h4>Team Name: {item.Team_Name}</h4>

            <div className="team-header">
                                <p><strong>Project:</strong> {item.Project_Name}</p>             

              <div className="team-meta">
                   <p><strong>Duration:</strong> {item.Start_Date} to {item.End_Date}</p>

              </div>
            </div>
            <p><strong>Client:</strong> {item.Client_Name}</p>

            <div className="description-box">

              <p><strong>Description:</strong></p>
              <pre>
{`Team "${item.Team_Name}" is working on "${item.Project_Name}" for client "${item.Client_Name}".
The project is currently "${item.Status}". Managed by ${item.Team_Manager}, 
with leadership from ${item.Team_Leader} and senior support by ${item.Team_senior}.`}
              </pre>
            </div>

            <div className="team-details-column">
              
              <p><strong>Team_Manager:</strong> {item.Team_Manager}</p>
              <p><strong>Team_Leader:</strong> {item.Team_Leader}</p>

              <p><strong>Team Members:</strong></p>
              <ul className="team-member-list">
                {item.Team_Member.map((member, i) => (
                  <li key={i}>
                    <div className="member-info">
                      <span className="member-name"> {member.name}</span>
                      <span className="member-role">{member.designation}</span>
                      <span className={`member-status ${member.attendance === "Present" ? "present" : "absent"}`}>
                        {member.attendance}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
                                              <p><strong>Status:</strong> {item.Status}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Team2;