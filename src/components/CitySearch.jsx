import React, { useState } from 'react';

const CitySearch = ({ allLocations = [], setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      setCurrentCity('See all cities');
      setInfoAlert('');
      return;
    }

    const filteredLocations = allLocations.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredLocations);
    setShowSuggestions(true);

    if (filteredLocations.length === 0) {
      setInfoAlert('We cannot find the city you are looking for. Please try another city.');
    } else {
      setInfoAlert('');
    }
  };

  const handleItemClicked = (suggestion) => {
    setQuery(suggestion);
    setCurrentCity(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setInfoAlert('');
  };

  return (
    <div className="city-search">
      <label htmlFor="city-search-input">Search for a city:</label>
      <input
        id="city-search-input"
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onChange={handleInputChanged}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleItemClicked(suggestion)}
              className="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
          <li
            key="See all cities"
            onClick={() => handleItemClicked('See all cities')}
            className="suggestion-item"
          >
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
