import React from 'react';
import Event from './Event';

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list" className="event-list">
      {(!events || events.length === 0) ? (
        <li><p>No events found.</p></li>
      ) : (
        events.map((event) => (
          <Event key={event.id} event={event} />
        ))
      )}
    </ul>
  );
};

export default EventList;
