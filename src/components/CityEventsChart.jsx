import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ScatterChart,
  Scatter,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getData = useCallback(() => {
    if (!allLocations || !events || !Array.isArray(allLocations) || !Array.isArray(events)) {
      return [];
    }
    const data = allLocations.map((location) => {
      const count = events.filter((event) => event && event.location === location).length;
      const city = location.split(/, | - /)[0];
      return { city, count };
    });
    return data;
  }, [allLocations, events]);

  useEffect(() => {
    setData(getData());
  }, [getData]);

  return (
    <div>
      <h4>Events by City</h4>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 300 : 400}>
          <ScatterChart
            data={data}
            margin={{
              top: 20,
              right: windowWidth <= 480 ? 10 : 20,
              bottom: windowWidth <= 480 ? 40 : 60,
              left: windowWidth <= 480 ? -20 : -30,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="category" 
              dataKey="city" 
              name="City"
              angle={windowWidth <= 480 ? 45 : 60} 
              interval={0} 
              tick={{ dx: 20, dy: 40, fontSize: windowWidth <= 480 ? 10 : 14 }}
            />
            <YAxis 
              type="number" 
              dataKey="count" 
              name="Number of events"
              allowDecimals={false}
              tick={{ fontSize: windowWidth <= 480 ? 10 : 12 }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Events" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No city data available</p>
        </div>
      )}
    </div>
  );
};

CityEventsChart.propTypes = {
  allLocations: PropTypes.arrayOf(PropTypes.string),
  events: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string
    })
  )
};

export default CityEventsChart;
