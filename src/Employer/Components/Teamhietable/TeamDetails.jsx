import React from "react";
 import { useLocation, useNavigate } from "react-router-dom";
import "./TeamDetails.css";

 const TeamDetails = () => {
  const { state } = useLocation();
  const { team } = state || {};
  const navigate = useNavigate();

  if (!team) return <p></p>;

  const toArray = (value) => (Array.isArray(value) ? value : [value]);

  return (
    <div className="hierarchy">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="level">
        <div className="node ceo">
             <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="CEO" />
          <div className="role">CEO</div>
          <div className="name">{team.ceo}</div>
        </div>
      </div>

      <div className="connector curvy"></div>

      <div className="level">
        <div className="node hr">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="HR Manager" />
          <div className="role">HR Manager</div>
          <div className="name">{team.hrManager}</div>
        </div>

        <div className="node manager">
          <img src="https://randomuser.me/api/portraits/men/20.jpg" alt="Manager" />
          <div className="role">Team Manager</div>
          <div className="name">{team.teamManager}</div>
        </div>
      </div>

      <div className="connector curvy"></div>

      <div className="level">
        {team.teamLeader && (
          <div className="node leader">
            <img src="https://randomuser.me/api/portraits/men/30.jpg" alt="Team Leader" />
            <div className="role">Team Lead</div>
            <div className="name">{team.teamLeader}</div>
          </div>
        )}
      </div>

      <div className="connector curvy"></div>

      <div className="level">
        {team.teamSenior && (
          <div className="node senior">
            <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="Team Senior" />
            <div className="role">Team Senior</div>
            <div className="name">{team.teamsenior}</div>
          </div>
        )}
      </div>

      <div className="connector curvy"></div>

      <div className="level devs">
        {toArray(team.teamMember).map((dev, i) => (
          <div className="node dev" key={`dev-${i}`}>
            <img src={`https://randomuser.me/api/portraits/men/${50 + i}.jpg`} alt="Developer" />
            <div className="role">Developer</div>
            <div className="name">{dev}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;