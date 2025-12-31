import React, { useState, useEffect } from "react";

const ExpenseTableWithFilter = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    type: "",
    client: ""
  });

  useEffect(() => {
    const savedItems = localStorage.getItem("expensesItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.date);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    return (
      (!from || itemDate >= from) &&
      (!to || itemDate <= to) &&
      (!filters.type ||
        item.type.toLowerCase().includes(filters.type.toLowerCase())) &&
      (!filters.client ||
        item.client.toLowerCase().includes(filters.client.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Filtered Expense Table</h2>

      {/* Filter Inputs */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={filters.type}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <input
          type="text"
          name="client"
          placeholder="Client"
          value={filters.client}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Filtered Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Client</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No matching results.
              </td>
            </tr>
          ) : (
            filteredItems.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.client}</td>
                <td>{item.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTableWithFilter;
