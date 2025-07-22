import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import EventChart from './components/EventChart';
import { extractLocations, getEvents } from './api';
import './App.css';

function App() {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities" ? 
        allEvents : 
        allEvents.filter(event => event.location === currentCity);
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    };

    if (navigator.onLine) {
      setWarningAlert("");
    } else {
      setWarningAlert("You are offline. Events displayed may not be up to date.");
    }
    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length ? <div className="alert info-alert">{infoAlert}</div> : null}
        {errorAlert.length ? <div className="alert error-alert">{errorAlert}</div> : null}
        {warningAlert.length ? <div className="alert warning-alert">{warningAlert}</div> : null}
      </div>
      
      <header className="app-header">
        <h1>Meet App</h1>
        <p>Find events in your city</p>
      </header>

      <div className="app-controls">
        <CitySearch 
          allLocations={allLocations} 
          setCurrentCity={setCurrentCity}
          setInfoAlert={setInfoAlert}
        />
        <NumberOfEvents 
          setCurrentNOE={setCurrentNOE}
          setErrorAlert={setErrorAlert}
          currentNOE={currentNOE}
        />
      </div>

      {/* Feature 6: Display Charts Visualizing Event Details */}
      <div className="charts-container">
        <EventChart events={events} />
      </div>

      <EventList events={events} />
    </div>
  );
}

export default App;