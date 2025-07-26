import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Add safety check for event object
  if (!event) {
    return null;
  }

  return (
    <li className="event">
      <h1>{event.summary || 'No title'}</h1>
      <p>{event.created || ''}</p>
      <p>{event.location || ''}</p>
      <button 
        className="details-btn"
        onClick={() => {
          setShowDetails(!showDetails);
        }}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="event-details">
          <h2>About event:</h2>
          <p className="event-description">{event.description || 'No description available'}</p>
          {event.htmlLink && (
            <a 
              href={event.htmlLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="event-link"
            >
              See details on Google Calendar
            </a>
          )}
        </div>
      )}
    </li>
  );
};

export default Event;
