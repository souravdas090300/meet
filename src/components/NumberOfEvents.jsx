<<<<<<< Updated upstream
import React, { useState, useEffect, useRef } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
  const [inputValue, setInputValue] = useState(currentNOE.toString());
  const timeoutRef = useRef(null);

  // Update local input value when currentNOE changes from parent
  useEffect(() => {
    setInputValue(currentNOE.toString());
  }, [currentNOE]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setInputValue(value); // Update local state immediately for smooth typing
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Allow empty input temporarily but don't trigger API calls
    if (value === '') {
      setErrorAlert('');
      return;
    }
    
    // Immediate validation for user feedback
    const numberValue = parseInt(value, 10);
    
    if (isNaN(numberValue) || numberValue < 1) {
      setErrorAlert('Only positive numbers are allowed');
      return;
    }
    
    if (numberValue > 100) {
      setErrorAlert('Please enter a number between 1 and 100');
      return;
    }
    
    // Clear error and debounce the parent state update to reduce API calls
    setErrorAlert('');
    timeoutRef.current = setTimeout(() => {
      setCurrentNOE(numberValue);
    }, 500); // Wait 500ms after user stops typing
  };

  const handleBlur = () => {
    // When user leaves the input, ensure we have a valid value
    if (inputValue === '') {
      setInputValue(currentNOE.toString());
      setErrorAlert('');
    } else {
      // Clear timeout and immediately validate
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const numberValue = parseInt(inputValue, 10);
      
      if (isNaN(numberValue) || numberValue < 1) {
        setErrorAlert('Only positive numbers are allowed');
        return;
      }
      
      if (numberValue > 100) {
        setErrorAlert('Please enter a number between 1 and 100');
        return;
      }
      
=======
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
>>>>>>> Stashed changes
      setErrorAlert('');
      setCurrentNOE(numberValue);
    }
  };

  return (
<<<<<<< Updated upstream
    <div id="number-of-events" className="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events:</label>
      <input
        id="number-of-events-input"
        data-testid="numberOfEventsInput"
        type="number"
        className="number-of-events-input"
        value={inputValue}
        onChange={handleInputChanged}
        onBlur={handleBlur}
=======
    <div className="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events:</label>
      <input
        id="number-of-events-input"
        type="number"
        className="number-of-events-input"
        value={currentNOE}
        onChange={handleInputChanged}
>>>>>>> Stashed changes
        min="1"
        max="100"
        placeholder="32"
      />
    </div>
  );
};

export default NumberOfEvents;
