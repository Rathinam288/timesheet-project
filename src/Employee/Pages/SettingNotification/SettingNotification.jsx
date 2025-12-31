import React from "react";
import Settingsnav from "../Settingsnav/Settingsnav";
import "./SettingNotification.css";
import LeaveCardViewSetting from "../LeaveCardViewSetting/LeaveCardViewSetting";
import SettingTimeSheetRequest from "../SettingTimesheetRequest/SettingTimeSheetRequest";
import TicketCardViewSetting from "../TicketCardViewSetting/TicketCardViewSetting";

function SettingNotification() {
  return (
    <>
      <Settingsnav />
      <div className="TicketCard">
        <TicketCardViewSetting />
      </div>
      <div className="LeaveCard">
        <LeaveCardViewSetting />
      </div>
      <div className="TimeRequest">
        <SettingTimeSheetRequest />
      </div>
    </>
  );
}

export default SettingNotification;
