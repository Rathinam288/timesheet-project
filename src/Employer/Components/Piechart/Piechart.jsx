import React from 'react';
import './Piechart.css';
 import { PieChart, Pie, Cell } from 'recharts';

const teamPerformanceData = [
  { name: 'Dev', value: 50 },
  { name: 'Marketing', value: 25 },
  { name: 'Product', value: 25 },
  { name: 'Others', value: 0 },
];

const COLORS = ['#007BFF', '#FFA500', '#FF6347', '#8884d8'];

 const Piechart = () => {
  return (
    <div className="team-performance-card">
      <h3 className="performance-title">Team Performance</h3>
      <div className="performance-content">
        <PieChart width={300} height={250}>
          <Pie
            data={teamPerformanceData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {teamPerformanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <ul className="legend-list">
          {teamPerformanceData.map((entry, index) => (
            <li key={index} style={{ color: COLORS[index % COLORS.length] }}>
              &#9632; {entry.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Piechart;