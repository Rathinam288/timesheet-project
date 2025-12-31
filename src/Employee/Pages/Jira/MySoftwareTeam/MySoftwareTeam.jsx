import React from "react";
import Board from "../../Jira/Board/Board";
import "./MySoftwareTeam.css";

const MySoftwareTeam = () => {
  return (
    <div className="jira-page">
      <header className="jira-header">
        <h1>🧩 My Software Team</h1>
      </header>

      <nav className="jira-tabs">
        <span>Summary</span>
        <span>List</span>
        <span className="active">Board</span>
        <span>Code</span>
        <span>Timeline</span>
        <span>Pages</span>
      </nav>

      <div className="jira-toolbar">
        <input placeholder="Search board" />
        <button>Filter</button>
      </div>

      <Board />
    </div>
  );
};

export default MySoftwareTeam;
