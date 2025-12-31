import React from 'react'
import Settingsnav from '../Settingsnav/Settingsnav'
import './SettingNotification.css'
import LeaveCardViewSetting from '../../Components/LeaveCardViewSetting/LeaveCardViewSetting'
import SettingTimeSheetRequest from '../../Components/SettingTimesheetRequest/SettingTimeSheetRequest'


function SettingNotification() {
  return (
    <>
        <Settingsnav/>
        <div className='LeaveCard'><LeaveCardViewSetting/></div>
<div className='TimeRequest'><SettingTimeSheetRequest/></div>
      
    </>
  )
}

export default SettingNotification