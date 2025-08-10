import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventChart = ({ events = [] }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 300 : 320}>
          <PieChart margin={{ 
            top: windowWidth <= 480 ? 10 : 20, 
            right: windowWidth <= 480 ? 30 : 60, 
            bottom: windowWidth <= 480 ? 50 : 60, 
            left: windowWidth <= 480 ? 30 : 60 
          }}>
            <Pie
              data={pieData}
              cx="50%"
              cy={windowWidth <= 480 ? "40%" : "45%"}
              labelLine={false}
              label={({ name, percent }) => percent > 0.05 ? 
                (windowWidth <= 480 ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`) 
                : null
              }
              outerRadius={windowWidth <= 480 ? 50 : 70}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ 
                paddingTop: '15px',
                fontSize: windowWidth <= 480 ? '12px' : '14px'
              }}
            />
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

EventChart.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string
    })
  )
};

export default EventChart;
