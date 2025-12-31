import React from "react";
import "./Dashboard.css";
import Teamtable from "../../Components/Teamtable/Teamtable";
import Activity from "../../Components/Activity/Activity";
import Workflow from "../../Components/Workflow/Workflow";
import LineChart from "../../Components/Linechart/LineChart";
import Infocards from "../../Components/Infocards/Infocards";

const Dashboad = ({ collapsed }) => {
  return (
    <div className="bashbord">
      <Workflow />
      <div className="teams">
        <LineChart />
      </div>
      <div className="overviewtable">
        <Teamtable />
        <Activity />
      </div>
      <div>
        <Infocards/>
      </div>
    </div>
  );
};

export default Dashboad;
