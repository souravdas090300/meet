import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CityEventsChart = ({ events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const extractLocations = (events) => {
      const extractedLocations = events.map((event) => event.location);
      const locations = [...new Set(extractedLocations)];
      return locations;
    };

    const getData = () => {
      const locations = extractLocations(events);
      const data = locations.map((location) => {
        const count = events.filter((event) => event.location === location).length;
        const city = location.split(/, | - /).shift();
        return { city, count };
      });
      return data;
    };

    setData(getData());
  }, [events]);

  return (
    <div>
      <h4>Events by City</h4>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis 
            type="category" 
            dataKey="city" 
            name="City"
            angle={60}
            textAnchor="start"
            height={100}
          />
          <YAxis 
            type="number" 
            dataKey="count" 
            name="Number of events"
            allowDecimals={false}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Events" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityEventsChart;
