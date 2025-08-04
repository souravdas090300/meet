import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import { getEvents, extractLocations, getAuthURL, logout, isLoggedIn } from './api';
import { logAtatusEvent } from './utils/atatus-helpers';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check authentication status
        const authStatus = isLoggedIn();
        setIsAuthenticated(authStatus);
        
        // Check online status and set warning alert accordingly
        if (navigator.onLine) {
          setWarningAlert("");
        } else {
          setWarningAlert("You are offline. Events displayed may not be up to date.");
        }

        const allEvents = await getEvents();
        
        // Ensure allEvents is an array and has valid data
        if (!allEvents || !Array.isArray(allEvents)) {
          setErrorAlert('Invalid data received. Please try again later.');
          setIsLoading(false);
          return;
        }

        const filteredEvents = currentCity === "See all cities" ? 
          allEvents : 
          allEvents.filter(event => event && event.location === currentCity);
        
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorAlert('Failed to load events. Please try again later.');
        setIsLoading(false);
        
        // Track error with Atatus
        if (typeof logAtatusEvent === 'function') {
          logAtatusEvent('API Error', 'error', {
            errorMessage: error.message,
            currentCity: currentCity,
            numberOfEvents: currentNOE,
            isOnline: navigator.onLine
          });
        }
      }
    };

    fetchData();

    // Add event listeners for online/offline status changes
    const handleOnline = () => {
      setWarningAlert("");
      fetchData(); // Refresh data when back online
    };

    const handleOffline = () => {
      setWarningAlert("You are offline. Events displayed may not be up to date.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentCity, currentNOE]);

  const handleLogin = async () => {
    try {
      const authUrl = await getAuthURL();
      window.location.href = authUrl;
    } catch {
      setErrorAlert('Failed to initiate login. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setInfoAlert('You have been logged out successfully.');
    // Refresh the page to reset the app state
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert}/> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert}/> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert}/> : null}
      </div>
      
      <header className="app-header">
        <h1>Meet App</h1>
        <p>Find events in your city</p>
        <div className="auth-controls">
          {isAuthenticated ? (
            <>
              <span className="auth-status">✓ Logged in with Google</span>
              <button className="auth-button logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="auth-button login" onClick={handleLogin}>
              Login with Google
            </button>
          )}
        </div>
      </header>

      {isLoading ? (
        <div className="loading-container">
          <p>Loading events...</p>
        </div>
      ) : (
        <>
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
            <CityEventsChart allLocations={allLocations} events={events} />
            <EventGenresChart events={events} />
          </div>
          
          <EventList events={events} />
        </>
      )}
    </div>
  );
}

export default App;
