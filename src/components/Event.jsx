import { useState } from "react";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className="event">
      <h1>{event.summary}</h1>
      <p>{event.created}</p>
      <p>{event.location}</p>
      <button
        className="details-btn"
        onClick={() => {
          showDetails ? setShowDetails(false) : setShowDetails(true);
        }}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="details">
          <h2>About event:</h2>
          <a href={event.htmlLink}>See details on Google Calendar</a>
          <p>{event.description}</p>
        </div>
      )}
    </li>
  );
};

export default Event;
