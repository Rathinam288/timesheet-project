import React from "react";
import "./Reportchart.css";
 import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", active: 7000, passive: 6000, business: 4000 },
  { name: "Feb", active: 6000, passive: 5500, business: 4500 },
  { name: "Mar", active: 8000, passive: 7500, business: 5000 },
  { name: "Apr", active: 10000, passive: 9000, business: 8000 },
  { name: "May", active: 9000, passive: 8000, business: 7000 },
  { name: "Jun", active: 9500, passive: 7900, business: 8500 },
  { name: "Jul", active: 9000, passive: 8000, business: 6500 },
];

 function Reportchart() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="income-summary">
          <h2>Monthly Income</h2>
          <p className="income-total">₹25,653.00</p>
          <p className="income-change">▲ 12% vs last year</p>
        </div>
        <div className="legend">
          <div><span className="dot active"></span> Active Income</div>
          <div><span className="dot passive"></span> Passive Income</div>
          <div><span className="dot business"></span> Business Income</div>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="business" stackId="a" fill="#4f46e5" />
            <Bar dataKey="passive" stackId="a" fill="#60a5fa" />
            <Bar dataKey="active" stackId="a" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Reportchart;