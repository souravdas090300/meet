import React from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
  const handleInputChanged = (event) => {
    let value = event.target.value;
    
    if (value === '') {
      setErrorAlert('');
      return;
    }

    const numberValue = parseInt(value, 10);
    
    if (isNaN(numberValue)) {
      setErrorAlert('');
      return;
    }
    
    if (numberValue <= 0) {
      setErrorAlert('Only positive numbers are allowed');
      return;
    }
    
    if (numberValue > 100) {
      setErrorAlert('Please enter a number between 1 and 100');
      return;
    }
    
    setErrorAlert('');
    setCurrentNOE(numberValue);
  };

  return (
    <div id="number-of-events" className="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events:</label>
      <input
        id="number-of-events-input"
        data-testid="numberOfEventsInput"
        type="number"
        className="number-of-events-input"
        value={currentNOE}
        onChange={handleInputChanged}
        min="1"
        max="100"
        placeholder="32"
      />
    </div>
  );
};

export default NumberOfEvents;
