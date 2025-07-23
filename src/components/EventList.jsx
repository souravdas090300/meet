<<<<<<< Updated upstream
import React from "react";
import Event from "./Event";
=======
import React from 'react';
import Event from './Event';
>>>>>>> Stashed changes

const EventList = ({ events }) => {
  return (
    <ul id="event-list">
      {events ? events.map(event => <Event key={event.id} event={event} />) : null}
    </ul>
  );
<<<<<<< Updated upstream
}
=======
};
>>>>>>> Stashed changes

export default EventList;
