import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
  const [inputValue, setInputValue] = useState(currentNOE.toString());

  // Update local input value when currentNOE changes from parent
  useEffect(() => {
    setInputValue(currentNOE.toString());
  }, [currentNOE]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setInputValue(value); // Update local state immediately for smooth typing
    
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
        value={inputValue}
        onChange={handleInputChanged}
        min="1"
        max="100"
        placeholder="32"
      />
    </div>
  );
};

export default NumberOfEvents;
