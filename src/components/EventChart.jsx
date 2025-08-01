import React from 'react';

const EventChart = ({ events = [] }) => {
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

  return (
    <div className="event-charts">
      <h3>Event Statistics</h3>
      
      <div className="chart-container">
        <h4>Events by Location</h4>
        <div className="simple-chart">
          {Object.entries(locationData).map(([location, count]) => (
            <div key={location} className="chart-item">
              <span>{location}: {count} events</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h4>Event Count by Location</h4>
        <div className="simple-chart">
          <p>Total events: {events.length}</p>
          <p>Unique locations: {Object.keys(locationData).length}</p>
        </div>
      </div>
    </div>
  );
};

export default EventChart;
