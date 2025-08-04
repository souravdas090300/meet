import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventChart = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="event-charts">
        <h3>Event Statistics</h3>
        <p>No events to display</p>
      </div>
    );
  }

  // Prepare data for charts
  const locationData = events.reduce((acc, event) => {
    const location = event.location;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(locationData).map(([location, count]) => ({
    name: location,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="event-charts">
      <h3>Event Statistics</h3>
      <p>Total events: {events.length}</p>
      
      <div className="chart-container">
        <h4>Events by Location</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Event Count by Location</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventChart;
