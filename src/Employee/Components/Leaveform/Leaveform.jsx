import React from "react";
import Leavedetails from "./Leavedetails/Leavedetails";
import Upcoming from "../../Pages/Leave/Leave/Upcoming/Upcoming";
import "./Leaveform.css";

function Leaveform({collapsed}) {
  return (
    <>
   <div className="upcom">
  <div className="left-section">
    <Leavedetails collapsed={collapsed}/>
  <div className="right-section">
    <Upcoming />
  </div>
  </div>

</div>

    </>
  );
}

export default Leaveform;