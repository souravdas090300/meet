import React from 'react';
import Event from './Event';

const EventList = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="event-list">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <ul id="event-list">
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </ul>
  );
};

export default EventList;
