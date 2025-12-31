import React from 'react'
import './Nextleaves.css'
import { useState,useEffect } from 'react';
import {tamilnaduGovtHoliday} from '../overallclient/Overallclient';
import pongal from '../../assets/govt_leave/pongal.jpeg';
import poet from '../../assets/govt_leave/paperpen.jpeg';
import pray from '../../assets/govt_leave/namaskaram.jpeg';
import crescentMoon from '../../assets/govt_leave/eidmubarak.jpeg';
import goodFriday from '../../assets/govt_leave/namaskaram.jpeg';
import workers from '../../assets/govt_leave/worker.jpeg';
import freedom from '../../assets/govt_leave/indipendant.jpeg';
import gandhi from '../../assets/govt_leave/gandhi.jpeg';
import lamp from '../../assets/govt_leave/lamp.jpeg';
import christmasTree from '../../assets/govt_leave/chirustmus.jpeg';
import gardener from '../../assets/govt_leave/police.jpeg';

const iconMap = {
  pongal,
  poet,
  pray,
  "crescent-moon": crescentMoon,
  "good-friday": goodFriday,
  workers,
  freedom,
  "mahatma-gandhi": gandhi,
  lamp,
  "christmas-tree": christmasTree,
  gardener,
};

function Nextleaves() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load holiday data
    setData(tamilnaduGovtHoliday);
  }, []);

  const today = new Date();

  const upcomingHolidays = data.filter(item => {
    const [day, month, year] = item.date.split('-');
    const holidayDate = new Date(`${year}-${month}-${day}`);
    return holidayDate >= today;
  });

  return (
    <div className="holiday-container">
      <h2 id="holiday-head">Upcoming Holidays</h2>
      {upcomingHolidays.map((item, index) => (
        <div key={index} className="holiday-card">
          <img
            src={iconMap[item.icon] || gardener}
            alt={item.holiday}
            className="holiday-icon"
          />
          <div className="holiday-info">
            <h3 className="holiday-name">{item.holiday}</h3>
            <p className="holiday-date">{item.date} ({item.day})</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Nextleaves;
