import React from "react";
import "../Dashboard/Dashboard.css";
import Piechart from "../../Components/Piechart/Piechart";
import Activity from "../../Components/Activity/Activity";
import Workflow from "../../Components/Workflow/Workflow";

import EmpBrithday from "../../Components/EmpBirthday/EmpBirthday";
import Company from "../../Components/Companys/Company";

 const Dashboard = () => {
  return (
    <div className="bashbord">
      <Workflow />
      <div className="teams-chart">
        <Activity />
        <Piechart />
      </div>
      <div className="overviewtable">
        <Company />
        
      </div>
      <div className="clientfeedback">
        <EmpBrithday />
      </div>
    </div>
  );
};

export default Dashboard;