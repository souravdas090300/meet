import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const EventChart = ({ events }) => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const getData = () => {
      // Feature 6, Scenario 1: Show a chart with the number of upcoming events in each city
      const locations = [...new Set(events.map((event) => event.location))];
      const data = locations.map((location) => {
        const count = events.filter((event) => event.location === location).length;
        const city = location.split(', ').shift();
        return { city, count };
      }).sort((a, b) => b.count - a.count); // Sort by count descending
      return data;
    };

    const getPieData = () => {
      const genres = ['JavaScript', 'React', 'Node.js', 'jQuery', 'Angular'];
      const data = genres.map((genre) => {
        const count = events.filter((event) => event.summary.includes(genre)).length;
        return { name: genre, value: count };
      }).filter(item => item.value > 0);
      return data;
    };

    setData(getData());
    setPieData(getPieData());
  }, [events]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="charts-container">
      {/* Feature 6, Scenario 1: Chart showing number of upcoming events in each city */}
      <div className="chart">
        <h2>Number of Upcoming Events by City</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="city" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Number of Events', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [value, 'Number of Events']}
              labelFormatter={(label) => `City: ${label}`}
            />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h2>Events Distribution (Scatter Plot)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="category" dataKey="city" name="City" />
            <YAxis type="number" dataKey="count" name="Number of events" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h2>Events by Genre</h2>
        <ResponsiveContainer width="100%" height={400}>
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
    </div>
  );
};

export default EventChart;
