import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const EventGenresChart = ({ events = [] }) => {
  const [data, setData] = useState([]);
  const genres = useMemo(() => ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'], []);
  const colors = useMemo(() => ['#DD0000', '#00DD00', '#0000DD', '#DDDD00', '#DD00DD'], []);

  // Data calculation
  const chartData = useMemo(() => {
    if (!events || !Array.isArray(events)) {
      return [];
    }
    
    const data = genres.map(genre => {
      const filteredEvents = events.filter(event => 
        event && 
        event.summary && 
        typeof event.summary === 'string' && 
        event.summary.includes(genre)
      );
      return {
        name: genre,
        value: filteredEvents.length
      };
    });
    return data;
  }, [events, genres]);

  useEffect(() => {
    console.log('EventGenresChart - events:', events?.length, events);
    console.log('EventGenresChart - chartData:', chartData);
    setData(chartData);
  }, [chartData, events]);

  // Label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent || percent < 0.05 || !genres || !genres[index]) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="500"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!data || data.length === 0 || !data.some(item => item.value > 0)) {
    return (
      <div style={{ width: '100%', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No genre data available for the chart</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Events by Genre</h4>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart margin={{ 
          top: 20, 
          right: 50, 
          bottom: 80, 
          left: 50 
        }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            dataKey="value"
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

EventGenresChart.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string
    })
  )
};

export default EventGenresChart;
