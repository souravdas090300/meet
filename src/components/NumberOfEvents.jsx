<<<<<<< Updated upstream
import React, { useState } from "react";

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert, currentNOE = 32 }) => {
  const [numberOfEvents, setNumberOfEvents] = useState(currentNOE);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumberOfEvents(value);

    let errorText;
    if (isNaN(value) || value <= 0) {
      errorText = "Only positive numbers are allowed"
    } else {
      errorText = "";
      if (setCurrentNOE) {
        setCurrentNOE(value);
      }
    }
    if (setErrorAlert) {
      setErrorAlert(errorText);
    }
=======
import React, { useState } from 'react';

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert, currentNOE = 32 }) => {
  const [numberValue, setNumberValue] = useState(currentNOE);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumberValue(value);

    let errorText;
    if (isNaN(value) || value <= 0) {
      errorText = "Only positive numbers are allowed";
    } else {
      errorText = "";
      setCurrentNOE && setCurrentNOE(value);
    }
    setErrorAlert && setErrorAlert(errorText);
>>>>>>> Stashed changes
  };

  return (
    <div id="number-of-events">
      <input
        type="text"
        className="number-of-events-input"
        placeholder="Number of Events"
<<<<<<< Updated upstream
        value={numberOfEvents}
=======
        value={numberValue}
>>>>>>> Stashed changes
        onChange={handleInputChanged}
        data-testid="numberOfEventsInput"
      />
    </div>
  );
};

export default NumberOfEvents;
