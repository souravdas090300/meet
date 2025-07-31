import React from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
  const handleInputChanged = (event) => {
    let value = event.target.value;
    
    if (value === '') {
      setErrorAlert('Please enter a number between 1 and 100');
      return;
    }

    const numberValue = parseInt(value, 10);
    
    if (isNaN(numberValue) || numberValue < 1 || numberValue > 100) {
      setErrorAlert('Please enter a number between 1 and 100');
    } else {
      setErrorAlert('');
      setCurrentNOE(numberValue);
    }
  };

  return (
    <div className="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events:</label>
      <input
        id="number-of-events-input"
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
