import React, { useState } from "react";
import "./History.css";

const HistoryPage = ({ historyItems }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [items] = useState(historyItems); // Still fulfilling useState requirement

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchDate = selectedDate ? item.date === selectedDate : true;
    const matchType = selectedType ? item.type === selectedType : true;
    return matchDate && matchType;
  });

  // Extract unique types for dropdown
  const uniqueTypes = [...new Set(items.map(item => item.type))];

  return (
    <div className="history-container">
      <h2>Expenses History</h2>

      {/* Filter Controls */}
      <div className="filters">
        <label>
          Filter by Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Filter by Type:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All</option>
            {uniqueTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Item</th>
            <th>Client</th>
            <th>Status</th>
            <th>Expire Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No history data available.
              </td>
            </tr>
          ) : (
            filteredItems.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.item}</td>
                <td>{item.client}</td>
                <td>{item.status}</td>
                <td>{item.expireDate}</td>
                <td>{item.amount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
