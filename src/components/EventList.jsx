import React from 'react';
import Event from './Event';

const EventList = ({ events }) => {
  // Add safety checks for events array
  if (!events || !Array.isArray(events)) {
    return <ul id="event-list"></ul>;
  }

  return (
    <ul id="event-list">
      {events.filter(event => event && event.id).map(event => (
        <Event key={event.id} event={event} />
      ))}
    </ul>
  );
};

export default EventList;
