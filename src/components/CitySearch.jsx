<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
=======
import React, { useState, useEffect } from 'react';
>>>>>>> Stashed changes

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
<<<<<<< Updated upstream
    const filteredLocations = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    }) : [];
=======
    const filteredLocations = allLocations ? 
      allLocations.filter((location) => {
        return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
      }) : [];
>>>>>>> Stashed changes

    setQuery(value);
    setSuggestions(filteredLocations);

    let infoText;
    if (filteredLocations.length === 0) {
<<<<<<< Updated upstream
      infoText = "We can not find the city you are looking for. Please try another city"
    } else {
      infoText = ""
    }
    if (setInfoAlert) {
      setInfoAlert(infoText);
    }
=======
      infoText = "We can not find the city you are looking for. Please try another city";
    } else {
      infoText = "";
    }
    setInfoAlert && setInfoAlert(infoText);
>>>>>>> Stashed changes
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
<<<<<<< Updated upstream
    if (setCurrentCity) {
      setCurrentCity(value);
    }
    if (setInfoAlert) {
      setInfoAlert("");
    }
=======
    setCurrentCity && setCurrentCity(value);
    setInfoAlert && setInfoAlert("");
>>>>>>> Stashed changes
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
          {suggestions.map((suggestion) => {
            return (
              <li onClick={handleItemClicked} key={suggestion}>
                {suggestion}
              </li>
            );
          })}
<<<<<<< Updated upstream
          <li onClick={handleItemClicked} key='See all cities'>
=======
          <li onClick={handleItemClicked} key="See all cities">
>>>>>>> Stashed changes
            <b>See all cities</b>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default CitySearch;
