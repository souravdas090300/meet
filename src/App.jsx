import React from 'react';


function App() {
  return (
    <div>
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import EventChart from './components/EventChart';
import { getEvents, extractLocations } from './api';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.onLine) {
          setWarningAlert("");
        } else {
          setWarningAlert("You are offline. Events displayed may not be up to date.");
        }

        const allEvents = await getEvents();
        
        // Ensure allEvents is an array and has valid data
        if (!allEvents || !Array.isArray(allEvents)) {
          setErrorAlert('Invalid data received. Please try again later.');
          return;
        }

        const filteredEvents = currentCity === "See all cities" ? 
          allEvents : 
          allEvents.filter(event => event && event.location === currentCity);
        
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorAlert('Failed to load events. Please try again later.');
      }
    };

    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert && <div className="alert alert-info">{infoAlert}</div>}
        {errorAlert && <div className="alert alert-error">{errorAlert}</div>}
        {warningAlert && <div className="alert alert-warning">{warningAlert}</div>}
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
          currentNOE={currentNOE}
          setCurrentNOE={setCurrentNOE} 
          setErrorAlert={setErrorAlert}
        />
      </div>

      <div className="charts-container">
        {events && events.length > 0 && <EventChart events={events} />}
      </div>
      
      <EventList events={events} />
    </div>
  );
}

export default App;
