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
    if (!percent || percent < 0.08 || !genres || !genres[index]) return null; // Increased threshold for mobile

    // For mobile, only show labels for significant slices
    if (windowWidth <= 480 && percent < 0.12) return null;

    const RADIAN = Math.PI / 180;
    // Use a more conservative radius calculation to prevent cutoff
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;
    
    // More conservative label positioning for mobile
    const labelRadius = isSmallMobile ? outerRadius * 0.95 : 
                       isMobile ? outerRadius * 1.05 : 
                       outerRadius * 1.12;
    
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={isSmallMobile ? '8px' : isMobile ? '9px' : '11px'}
        fontWeight="500"
      >
        {isSmallMobile ? `${(percent * 100).toFixed(0)}%` : `${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Dynamic outer radius based on screen size with more conservative sizing
  const getOuterRadius = () => {
    if (windowWidth <= 480) return 45;  // Small mobile - very conservative
    if (windowWidth <= 768) return 60;  // Large mobile/tablet - conservative
    return 80; // Desktop - conservative
  };

  return (
    <div style={{ width: '100%', minHeight: '350px' }}>
      <h4>Events by Genre</h4>
      {data && data.length > 0 && data.some(item => item.value > 0) ? (
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 320 : 380} minHeight={300}>
          <PieChart margin={{ 
            top: 10, 
            right: windowWidth <= 480 ? 20 : 50, 
            bottom: windowWidth <= 480 ? 80 : 70, 
            left: windowWidth <= 480 ? 20 : 50 
          }}>
            <Pie
              data={data}
              cx="50%"
              cy={windowWidth <= 480 ? "35%" : "40%"}
              dataKey="value"
              fill="#8884d8"
              labelLine={false}
              label={windowWidth <= 480 ? false : renderCustomizedLabel}
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
                paddingTop: windowWidth <= 480 ? '10px' : '15px',
                fontSize: windowWidth <= 480 ? '11px' : '12px',
                lineHeight: '1.2'
              }}
              iconType="circle"
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
