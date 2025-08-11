import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import { getEvents, extractLocations, getAuthURL, getToken, extractAuthCode, removeQuery, logout, isLoggedIn } from './api';
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

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const authResult = extractAuthCode();
      
      if (authResult?.error) {
        console.error('❌ OAuth error detected:', authResult.error);
        setErrorAlert(`Authentication error: ${authResult.error}. Please try again.`);
        setTimeout(() => setErrorAlert(''), 5000);
        return;
      }
      
      if (authResult?.code) {
        console.log('🔑 OAuth callback detected, exchanging code for token');
        setInfoAlert('Processing authentication...');
        
        try {
          const accessToken = await getToken(authResult.code);
          if (accessToken) {
            setIsAuthenticated(true);
            setInfoAlert('Successfully authenticated with Google!');
            console.log('✅ Authentication successful');
            
            // Remove the code parameter from URL
            removeQuery();
            
            // Clear success message after 3 seconds
            setTimeout(() => setInfoAlert(''), 3000);
          }
        } catch (error) {
          console.error('❌ OAuth callback error:', error);
          setErrorAlert('Authentication failed. Please try again.');
          
          // Clear error message after 5 seconds
          setTimeout(() => setErrorAlert(''), 5000);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check authentication status
        const authStatus = isLoggedIn();
        setIsAuthenticated(authStatus);
        
        if (authStatus) {
          console.log('👤 User is authenticated');
        } else {
          console.log('🔓 User is not authenticated');
        }
        
        // Check online status and set warning alert accordingly
        if (navigator.onLine) {
          setWarningAlert("");
        } else {
          setWarningAlert("You are offline. Events displayed may not be up to date.");
        }

        const allEvents = await getEvents();
        console.log('📊 All events received:', allEvents);
        console.log('📊 Number of events:', allEvents?.length);
        console.log('📊 Event data type:', typeof allEvents);
        console.log('📊 Is array:', Array.isArray(allEvents));
        
        // Ensure allEvents is an array and has valid data
        if (!allEvents || !Array.isArray(allEvents)) {
          console.error('❌ Invalid data received:', allEvents);
          setErrorAlert('Invalid data received. Please try again later.');
          setIsLoading(false);
          return;
        }

        if (allEvents.length === 0) {
          console.warn('⚠️ No events in the received data');
          setEvents([]);
          setAllLocations([]);
          setErrorAlert('No events available at this time.');
          setIsLoading(false);
          return;
        }

        const filteredEvents = currentCity === "See all cities" ? 
          allEvents : 
          allEvents.filter(event => event && event.location === currentCity);
        
        console.log('🔍 Filtered events:', filteredEvents.length);
        console.log('🔢 Current NOE:', currentNOE);
        console.log('🏙️ Current city:', currentCity);
        
        const finalEvents = filteredEvents.slice(0, currentNOE);
        console.log('✅ Final events to display:', finalEvents.length);
        
        setEvents(finalEvents);
        setAllLocations(extractLocations(allEvents));
        setErrorAlert(''); // Clear any previous errors
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
      setInfoAlert('Connecting to authentication server...');
      setErrorAlert(''); // Clear any previous errors
      
      const authUrl = await getAuthURL();
      console.log('🔗 Redirecting to auth URL:', authUrl);
      
      setInfoAlert('Redirecting to Google for authentication...');
      
      // Add a small delay to show the info message
      setTimeout(() => {
        window.location.href = authUrl;
      }, 800);
    } catch (error) {
      console.error('❌ Login error:', error);
      setInfoAlert('');
      
      if (error.message.includes('Failed to fetch')) {
        setErrorAlert('Unable to connect to authentication server. Please check your internet connection and try again.');
      } else if (error.message.includes('404')) {
        setErrorAlert('Authentication service not found. Please contact support.');
      } else if (error.message.includes('500')) {
        setErrorAlert('Authentication server error. Please try again later.');
      } else {
        setErrorAlert(`Authentication failed: ${error.message}`);
      }
      
      // Clear error message after 8 seconds
      setTimeout(() => setErrorAlert(''), 8000);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out user');
    logout();
    setIsAuthenticated(false);
    setInfoAlert('You have been logged out successfully.');
    
    // Clear the info message after 3 seconds
    setTimeout(() => setInfoAlert(''), 3000);
    
    // Force a page reload to reset the app state and fetch new data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
        {!isAuthenticated && (
          <div style={{ 
            background: '#e7f3ff', 
            border: '1px solid #b3d9ff', 
            borderRadius: '8px', 
            padding: '1rem', 
            margin: '1rem 0',
            fontSize: '14px'
          }}>
            <strong>📋 Currently showing demo events.</strong><br/>
            <span>To see real Google Calendar events, please log in with your Google account below.</span>
          </div>
        )}
        <div className="auth-controls">
          {isAuthenticated ? (
            <>
              <span className="auth-status">✓ Logged in with Google - Showing real events</span>
              <button className="auth-button logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="auth-button login" onClick={handleLogin}>
              Login with Google to see real events
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

          {/* Debug info */}
          <div style={{ margin: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
            <strong>Debug Info:</strong> 
            Events: {events?.length || 0} | 
            Locations: {allLocations?.length || 0} | 
            Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'} | 
            Current City: {currentCity} | 
            Number of Events: {currentNOE} | 
            Event Source: {isAuthenticated ? '🌐 Real Google Calendar' : '📋 Demo/Mock Data'} |
            Online: {navigator.onLine ? '✅' : '❌'}
          </div>

          <div className="charts-container">
            <CityEventsChart allLocations={allLocations} events={events} />
            <EventGenresChart events={events} />
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
