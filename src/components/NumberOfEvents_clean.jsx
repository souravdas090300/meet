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
  };

  return (
    <div id="number-of-events">
      <input
        type="text"
        className="number-of-events-input"
        placeholder="Number of Events"
        value={numberValue}
        onChange={handleInputChanged}
        data-testid="numberOfEventsInput"
      />
    </div>
  );
};

export default NumberOfEvents;
