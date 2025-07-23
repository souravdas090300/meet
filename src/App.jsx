import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import EventChart from './components/EventChart';
<<<<<<< Updated upstream
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
=======
import { getEvents, extractLocations } from './api';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEvents = await getEvents();
        const filteredEvents = currentCity === "See all cities" ? 
          allEvents : 
          allEvents.filter(event => event.location === currentCity);
        
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorAlert('Failed to load events. Please try again later.');
      }
    };

>>>>>>> Stashed changes
    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container">
<<<<<<< Updated upstream
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

=======
        {infoAlert && <div className="alert alert-info">{infoAlert}</div>}
        {errorAlert && <div className="alert alert-error">{errorAlert}</div>}
      </div>
      
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
      
      <div className="charts-container">
        <EventChart events={events} />
      </div>
      
>>>>>>> Stashed changes
      <EventList events={events} />
    </div>
  );
}

<<<<<<< Updated upstream
export default App;
=======
export default App;
>>>>>>> Stashed changes
