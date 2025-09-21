import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import { getEvents, extractLocations, getAuthURL, logout, isLoggedIn, getToken, removeQuery, clearOAuthState } from './api';
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallButton(false);
      setInfoAlert('Meet App installed successfully! 🎉');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setInfoAlert('App installation started! 📱');
    } else {
      setInfoAlert('App installation cancelled.');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Handle OAuth redirect on mount
  useEffect(() => {
    let isProcessing = false; // Local flag to prevent multiple simultaneous processing
    
    const handleOAuthRedirect = async () => {
      if (isProcessing) {
        console.log('OAuth processing already in progress, skipping...');
        return;
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Check if we've already processed this specific code
        const processedCode = sessionStorage.getItem('processed_oauth_code');
        if (processedCode === code) {
          console.log('OAuth code already processed, skipping...');
          removeQuery();
          return;
        }
        
        isProcessing = true; // Set local processing flag
        
        try {
          // Mark this code as being processed
          sessionStorage.setItem('processing_oauth_code', code);
          
          // Exchange authorization code for access token
          await getToken(code);
          
          // Mark as successfully processed
          sessionStorage.setItem('processed_oauth_code', code);
          sessionStorage.removeItem('processing_oauth_code');
          
          setIsAuthenticated(true);
          setInfoAlert('Successfully logged in with Google!');
          // Remove the code from URL
          removeQuery();
        } catch (error) {
          console.error('OAuth token exchange failed:', error);
          sessionStorage.removeItem('processing_oauth_code');
          
          // Clear OAuth state on errors
          clearOAuthState();
          
          // Handle specific error cases
          if (error.message.includes('invalid_grant')) {
            setErrorAlert('Authorization code expired or invalid. Please try logging in again.');
          } else if (error.message.includes('400')) {
            setErrorAlert('Authentication failed. Please try again.');
          } else {
            setErrorAlert('Login failed. Please check your connection and try again.');
          }
          
          // Remove the invalid code from URL
          removeQuery();
        } finally {
          isProcessing = false; // Reset local processing flag
        }
      } else {
        // Check existing authentication status
        const authStatus = isLoggedIn();
        setIsAuthenticated(authStatus);
      }
    };

    handleOAuthRedirect();
  }, []); // Run only once on mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
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

        // Clear error alert on successful data fetch
        setErrorAlert("");

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
          {showInstallButton && (
            <button className="auth-button install" onClick={handleInstallClick}>
              📱 Install App
            </button>
          )}
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
            <div className="chart-section">
              <CityEventsChart allLocations={allLocations} events={events} />
            </div>
            <div className="chart-section">
              <EventGenresChart events={events} />
            </div>
          </div>
          
          <div className="event-list-container">
            <EventList events={events} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
