import React from 'react';
<<<<<<< Updated upstream
import Event from './Event';
=======
>>>>>>> Stashed changes

const EventList = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="event-list">
        <p>No events found.</p>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <ul id="event-list">
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </ul>
=======
    <div className="event-list">
      {events.map((event) => (
        <div key={event.id} className="event-item">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-description">{event.description}</p>
          <div className="event-details">
            <span className="event-location">📍 {event.location}</span>
            <span className="event-date">📅 {event.date}</span>
            <span className="event-time">🕐 {event.time}</span>
          </div>
        </div>
      ))}
    </div>
>>>>>>> Stashed changes
  );
};

export default EventList;
