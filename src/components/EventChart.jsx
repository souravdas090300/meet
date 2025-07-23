import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const EventChart = ({ events }) => {
  const [cityData, setCityData] = useState([]);
  const [techData, setTechData] = useState([]);

  useEffect(() => {
    const getCityData = () => {
      // Safely extract unique locations and handle undefined/null values
      const uniqueLocations = [...new Set(events
        .filter(event => event && event.location && typeof event.location === 'string')
        .map(event => event.location))];
        
      return uniqueLocations.map(location => {
        const count = events.filter(event => 
          event && event.location === location
        ).length;
        const city = location.split(', ')[0];
        return { city, count };
      }).filter(data => data.count > 0);
    };

    const getTechData = () => {
      const genres = ['JavaScript', 'React', 'Node.js', 'jQuery', 'Angular'];
      return genres.map(genre => {
        const count = events.filter(event => 
          event && event.summary && event.summary.includes(genre)
        ).length;
        return { name: genre, value: count };
      }).filter(item => item.value > 0);
    };

    if (events && events.length > 0) {
      setCityData(getCityData());
      setTechData(getTechData());
    }
  }, [events]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="charts-container">
      {/* Scatter chart showing number of events by city */}
      <div className="chart">
        <h2>Events by City</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
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
            <Scatter data={cityData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart showing distribution of technologies */}
      {techData.length > 0 && (
        <div className="chart">
          <h2>Event Technologies</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={techData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {techData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EventChart;
