import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Memoized data calculation for better performance
  const chartData = useMemo(() => {
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
    setData(chartData);
  }, [chartData]);

  return (
    <div style={{ width: '100%', minHeight: '380px' }}>
      <h4>Events by City</h4>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 320 : 420} minHeight={300}>
          <ScatterChart
            data={data}
            margin={{
              top: 25,
              right: windowWidth <= 480 ? 15 : 25,
              bottom: windowWidth <= 480 ? 60 : 80,
              left: windowWidth <= 480 ? 0 : -20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              type="category" 
              dataKey="city" 
              name="City"
              angle={windowWidth <= 480 ? 30 : 45} 
              interval={0} 
              tick={{ dx: 5, dy: 25, fontSize: windowWidth <= 480 ? 10 : 12 }}
              height={windowWidth <= 480 ? 70 : 90}
              textAnchor="end"
            />
            <YAxis 
              type="number" 
              dataKey="count" 
              name="Number of events"
              allowDecimals={false}
              tick={{ fontSize: windowWidth <= 480 ? 10 : 12 }}
              width={windowWidth <= 480 ? 35 : 45}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
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
