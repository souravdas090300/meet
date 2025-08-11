import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const EventGenresChart = ({ events = [] }) => {
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const genres = useMemo(() => ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'], []);
  const colors = useMemo(() => ['#DD0000', '#00DD00', '#0000DD', '#DDDD00', '#DD00DD'], []);

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

  // Memoized data calculation
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
    setData(chartData);
  }, [chartData]);

  // Memoized label renderer for performance
  const renderCustomizedLabel = useCallback(({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent || percent < 0.08 || !genres || !genres[index]) return null;

    // For mobile, only show labels for significant slices
    if (windowWidth <= 480 && percent < 0.15) return null;

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
  }, [windowWidth, genres]);

  // Dynamic outer radius based on screen size with more conservative sizing
  const getOuterRadius = useCallback(() => {
    if (windowWidth <= 480) return 50;  // Small mobile - increased size
    if (windowWidth <= 768) return 70;  // Large mobile/tablet
    return 90; // Desktop
  }, [windowWidth]);

  return (
    <div style={{ width: '100%', minHeight: '350px' }}>
      <h4>Events by Genre</h4>
      {data && data.length > 0 && data.some(item => item.value > 0) ? (
        <ResponsiveContainer width="100%" height={windowWidth <= 480 ? 350 : 400} minHeight={320}>
          <PieChart margin={{ 
            top: 20, 
            right: windowWidth <= 480 ? 30 : 50, 
            bottom: windowWidth <= 480 ? 90 : 80, 
            left: windowWidth <= 480 ? 30 : 50 
          }}>
            <Pie
              data={data}
              cx="50%"
              cy={windowWidth <= 480 ? "40%" : "45%"}
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
                paddingTop: windowWidth <= 480 ? '15px' : '20px',
                fontSize: windowWidth <= 480 ? '12px' : '14px',
                lineHeight: '1.4'
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
