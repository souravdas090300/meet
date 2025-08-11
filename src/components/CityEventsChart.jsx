import React, { useState, useEffect, useMemo } from 'react';
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

  // Data calculation
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
    console.log('CityEventsChart - allLocations:', allLocations?.length, allLocations);
    console.log('CityEventsChart - events:', events?.length, events);
    console.log('CityEventsChart - chartData:', chartData);
    setData(chartData);
  }, [chartData, allLocations, events]);

  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No city data available for the chart</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Events by City</h4>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 80,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            type="category" 
            dataKey="city" 
            name="City"
            angle={-45} 
            interval={0} 
            tick={{ dx: -10, dy: 15, fontSize: 12 }}
            height={80}
            textAnchor="end"
          />
          <YAxis 
            type="number" 
            dataKey="count" 
            name="Number of events"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            width={50}
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
