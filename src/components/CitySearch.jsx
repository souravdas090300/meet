import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (allLocations && Array.isArray(allLocations)) {
      setSuggestions(allLocations);
    } else {
      setSuggestions([]);
    }
  }, [allLocations]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = (allLocations && Array.isArray(allLocations)) ? 
      allLocations.filter((location) => {
        return location && typeof location === 'string' && 
               location.toUpperCase().indexOf(value.toUpperCase()) > -1;
      }) : [];

    setQuery(value);
    setSuggestions(filteredLocations);

    let infoText;
    if (filteredLocations.length === 0) {
      infoText = "We can not find the city you are looking for. Please try another city";
    } else {
      infoText = "";
    }
    setInfoAlert && setInfoAlert(infoText);
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity && setCurrentCity(value);
    setInfoAlert && setInfoAlert("");
  };

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
        data-testid="city-search-input"
      />
      {showSuggestions ? (
        <ul className="suggestions">
          {suggestions && suggestions.length > 0 && suggestions.map((suggestion) => {
            if (!suggestion || typeof suggestion !== 'string') return null;
            return (
              <li onClick={handleItemClicked} key={suggestion}>
                {suggestion}
              </li>
            );
          })}
          <li onClick={handleItemClicked} key="See all cities">
            <b>See all cities</b>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default CitySearch;
