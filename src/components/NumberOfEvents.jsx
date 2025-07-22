import React, { useState } from "react";

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert, currentNOE }) => {
  const [numberOfEvents, setNumberOfEvents] = useState(currentNOE);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumberOfEvents(value);

    let errorText;
    if (isNaN(value) || value <= 0) {
      errorText = "Only positive numbers are allowed"
    } else {
      errorText = "";
      setCurrentNOE(value);
    }
    setErrorAlert(errorText);
  };

  return (
    <div id="number-of-events">
      <input
        type="text"
        className="number-of-events-input"
        placeholder="Number of Events"
        value={numberOfEvents}
        onChange={handleInputChanged}
        data-testid="numberOfEventsInput"
      />
    </div>
  );
};

export default NumberOfEvents;
