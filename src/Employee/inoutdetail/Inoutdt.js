
import React from 'react';
import './Inoutdt.css';

function Inoutdt() {

  return (
    <div className="containerr">
      <div className="form">
        <table>
          <thead className="header">
            <tr>
              <th className="header-item"><a className="filter" href="#">S.no</a></th>
              <th className="header-item"><a className="filter" href="#">Employee Id</a></th>
              <th className="header-item"><a className="filter" href="#">Name</a></th>
              <th className="header-item"><a className="filter" href="#">Date</a></th>
              <th className="header-item"><a className="filter" href="#">Day</a></th>
              <th className="header-item"><a className="filter" href="#">Time</a></th>
              <th className="header-item"><a className="filter" href="#">In / Out</a></th>
              <th className="header-item"><a className="filter" href="#">Total Duration</a></th>
            </tr>
          </thead>
          <tbody className="all-content">
            <tr className="content-row">
              <td className="data">1</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">09:00 AM</td>
              <td className="data">IN</td>
              <td className="data">-</td>
            </tr>
            <tr className="content-row">
              <td className="data">2</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">11:00 AM</td>
              <td className="data">OUT</td>
              <td className="data">2 hours</td>
            </tr>
            <tr className="content-row">
              <td className="data">3</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">11:15 AM</td>
              <td className="data">IN</td>
              <td className="data">2 hours</td>
            </tr>
            <tr className="content-row">
              <td className="data">4</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">01:00 PM</td>
              <td className="data">OUT</td>
              <td className="data">3 hours 45 minutes</td>
            </tr>
            <tr className="content-row">
              <td className="data">5</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">01:15 PM</td>
              <td className="data">IN</td>
              <td className="data">3 hours 45 minutes</td>
            </tr>
            <tr className="content-row">
              <td className="data">6</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">04:00 PM</td>
              <td className="data">OUT</td>
              <td className="data">6 hours 15 minutes</td>
            </tr>
            <tr className="content-row">
              <td className="data">7</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">04:15 PM</td>
              <td className="data">IN</td>
              <td className="data">6 hours 15 minutes</td>
            </tr>
            <tr className="content-row">
              <td className="data">8</td>
              <td className="data">001</td>
              <td className="data">John Doe</td>
              <td className="data">22-06-2025</td>
              <td className="data">Monday</td>
              <td className="data">06:00 PM</td>
              <td className="data">OUT</td>
              <td className="data">8 hours</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inoutdt;
