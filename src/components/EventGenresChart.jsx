import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const EventGenresChart = ({ events = [] }) => {
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const genres = useMemo(() => ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'], []);
  const colors = ['#DD0000', '#00DD00', '#0000DD', '#DDDD00', '#DD00DD'];

  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getData = () => {
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
    };

    setData(getData());
  }, [events, genres]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent || percent < 0.05 || !genres || !genres[index]) return null; // Don't show labels for very small slices or missing data

    // For mobile, don't show labels if they might cause overflow
    if (windowWidth <= 480 && percent < 0.15) return null;

    const RADIAN = Math.PI / 180;
    // Use a more conservative radius calculation to prevent cutoff
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;
    
    // More conservative label positioning for mobile
    const labelRadius = isSmallMobile ? outerRadius * 1.05 : 
                       isMobile ? outerRadius * 1.08 : 
                       outerRadius * 1.15;
    
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={isSmallMobile ? '9px' : isMobile ? '10px' : '12px'}
        fontWeight="500"
      >
        {isSmallMobile ? `${(percent * 100).toFixed(0)}%` : `${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Dynamic outer radius based on screen size with more conservative sizing
  const getOuterRadius = () => {
    if (windowWidth <= 480) return 50;  // Small mobile - very conservative
    if (windowWidth <= 768) return 65;  // Large mobile/tablet - conservative
    return 85; // Desktop - conservative
  };

  return (
    <div>
      <h4>Events by Genre</h4>
      {data && data.length > 0 && data.some(item => item.value > 0) ? (
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 350 : 400}>
          <PieChart margin={{ 
            top: windowWidth <= 480 ? 10 : 20, 
            right: windowWidth <= 480 ? 40 : 80, 
            bottom: windowWidth <= 480 ? 60 : 80, 
            left: windowWidth <= 480 ? 40 : 80 
          }}>
            <Pie
              data={data}
              cx="50%"
              cy={windowWidth <= 480 ? "40%" : "45%"}
              dataKey="value"
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={getOuterRadius()}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ 
                paddingTop: windowWidth <= 480 ? '10px' : '20px',
                fontSize: windowWidth <= 480 ? '12px' : '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No genre data available</p>
        </div>
      )}
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
