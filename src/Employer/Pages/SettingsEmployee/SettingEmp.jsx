import React from "react";
import Settingsnav from "../Settingsnav/Settingsnav";
import "./SettingsEmp.css";

 function SettingEmp() {
  return (
    <>
      <Settingsnav />
      <div className="setting-emp-container">
        <h6>Employee Details</h6>
        <form>
          <div>
            <label>Employee PF PDF:</label>
            <input type="file" accept="application/pdf" />
          </div>
          <div>
            <label>Employee Circular PDF:</label>
            <input type="file" accept="application/pdf" />
          </div>
          <div>
            <label>Employee Expense PDF:</label>
            <input type="file" accept="application/pdf" />
          </div>
          <div>
            <label>Employee Offer-Letter PDF:</label>
            <input type="file" accept="application/pdf" />
          </div>
           <div>
            <label>Employee Leave Policy and FAQs:</label>
            <input type="file" accept="application/pdf" />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </>
  );
}

export default SettingEmp;
