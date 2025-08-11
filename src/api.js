/**
 * API Configuration for Meet App
 * 
 * To get your actual API Gateway URL:
 * 1. Deploy your auth-server using: serverless deploy
 * 2. Copy the API Gateway URL from the deployment output
 * 3. Replace YOUR_API_GATEWAY_ID below with the actual ID
 * 
 * The URL format should be:
 * https://{api-gateway-id}.execute-api.eu-central-1.amazonaws.com/dev
 */

import mockData from './mock-data';

// Replace this with your actual deployed AWS Lambda API Gateway URL
// Format: https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
const AUTH_SERVER_URL = "https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev";

// Check if code is in the URL (from OAuth redirect)
export const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
  console.log('🧹 Cleaned URL parameters');
};

// Extract authorization code from URL
export const extractAuthCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  
  if (error) {
    console.error('❌ OAuth error in URL:', error);
    return { error };
  }
  
  if (code) {
    console.log('🔑 Authorization code found in URL');
    return { code };
  }
  
  return null;
};

// Check if user is authenticated
export const checkToken = async (accessToken) => {
  try {
    const result = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    
    if (!result.ok) {
      throw new Error(`Token validation failed: ${result.status}`);
    }
    
    const tokenInfo = await result.json();
    
    if (tokenInfo.error) {
      console.log('🔑 Token validation failed:', tokenInfo.error);
      return { error: tokenInfo.error };
    }
    
    console.log('✅ Token is valid');
    return tokenInfo;
  } catch (error) {
    console.error('❌ Error validating token:', error);
    return { error: error.message };
  }
};

// Get OAuth access token
export const getToken = async (code) => {
  try {
    console.log('🔑 Exchanging authorization code for access token...');
    const encodeCode = encodeURIComponent(code);
    const response = await fetch(`${AUTH_SERVER_URL}/api/token/${encodeCode}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    const { access_token } = result;
    
    if (!access_token) {
      throw new Error('No access token received from server');
    }
    
    // Store the access token
    localStorage.setItem("access_token", access_token);
    
    // Store token expiry if provided (usually 1 hour for Google tokens)
    if (result.expires_in) {
      const expiryTime = Date.now() + (result.expires_in * 1000);
      localStorage.setItem("tokenExpiry", expiryTime.toString());
    }
    
    console.log('✅ Access token stored successfully');
    
    return access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    // Make sure to clear any invalid token
    localStorage.removeItem("access_token");
    throw error;
  }
};

// Get authorization URL
export const getAuthURL = async () => {
  try {
    console.log('🔗 Requesting auth URL from server...');
    const response = await fetch(`${AUTH_SERVER_URL}/api/get-auth-url`);
    
    if (!response.ok) {
      throw new Error(`Failed to get auth URL: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const { authUrl } = result;
    
    if (!authUrl) {
      throw new Error('No auth URL received from server');
    }
    
    console.log('✅ Auth URL received successfully');
    return authUrl;
  } catch (error) {
    console.error('❌ Error getting auth URL:', error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  console.log('🚪 Logging out - clearing all stored data');
  localStorage.removeItem("access_token");
  localStorage.removeItem("lastEvents");
  localStorage.removeItem("lastEventsTimestamp");
  
  // Clear any cached user data
  localStorage.removeItem("userProfile");
  localStorage.removeItem("tokenExpiry");
  
  console.log('✅ Logout complete');
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return false;
  }
  
  // Check if token is expired (basic check)
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    console.log('🕐 Token has expired, logging out');
    logout();
    return false;
  }
  
  return true;
};

// Helper function to get access token for API calls
const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenInfo = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenInfo.error) {
    await localStorage.removeItem("access_token");
    return null;
  }
  return accessToken;
};

// Helper function to fetch events from Google Calendar API
const getEventsFromAPI = async (accessToken) => {
  try {
    const response = await fetch(`${AUTH_SERVER_URL}/api/get-events/${accessToken}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    // Cache the events in localStorage for offline use
    try {
      localStorage.setItem("lastEvents", JSON.stringify(events));
      localStorage.setItem("lastEventsTimestamp", Date.now().toString());
      console.log('✅ Real events cached for offline use');
    } catch (storageError) {
      console.warn('Failed to cache events:', storageError);
    }
    
    return events;
  } catch (error) {
    console.error('❌ Error fetching events from Google Calendar API:', error);
    throw error;
  }
};

/**
 * Fetch events from API or return cached data when offline
 */
export const getEvents = async () => {
  console.log('🚀 getEvents called');
  
  // Check if user is offline and return cached events
  if (!navigator.onLine) {
    console.log('📵 User is offline');
    const cachedEvents = localStorage.getItem("lastEvents");
    if (cachedEvents) {
      console.log('💾 Loading events from cache (offline mode)');
      try {
        const parsedEvents = JSON.parse(cachedEvents);
        return Array.isArray(parsedEvents) ? parsedEvents : mockData;
      } catch (error) {
        console.error('Error parsing cached events:', error);
        return mockData;
      }
    }
    // If no cached events, return mock data as fallback
    console.log('📂 No cached events found, using mock data (offline)');
    return mockData;
  }

  // Always try to get real events first if user is authenticated
  console.log('� Attempting to fetch real events from API');
  
  const token = await getAccessToken();
  
  if (token) {
    console.log('🔑 Access token found, fetching real events');
    try {
      const events = await getEventsFromAPI(token);
      if (events && events.length > 0) {
        console.log(`✅ Successfully fetched ${events.length} real events from API`);
        return events;
      } else {
        console.log('⚠️ API returned no events');
        // Try cached events before falling back to mock data
        const cachedEvents = localStorage.getItem("lastEvents");
        if (cachedEvents) {
          try {
            const parsedEvents = JSON.parse(cachedEvents);
            console.log('💾 Using cached events (no new events from API)');
            return Array.isArray(parsedEvents) ? parsedEvents : mockData;
          } catch (parseError) {
            console.error('Error parsing cached events:', parseError);
          }
        }
        console.log('📋 No real events available, using mock data');
        return mockData;
      }
    } catch (error) {
      console.error('❌ Error fetching from API:', error);
      
      // Try to return cached events if API fails
      const cachedEvents = localStorage.getItem("lastEvents");
      if (cachedEvents) {
        console.log('💾 API failed, loading events from cache');
        try {
          const parsedEvents = JSON.parse(cachedEvents);
          return Array.isArray(parsedEvents) ? parsedEvents : mockData;
        } catch (parseError) {
          console.error('Error parsing cached events:', parseError);
        }
      }
      
      // Return mock data as final fallback
      console.log('📋 API failed and no cache available, using mock data');
      return mockData;
    }
  } else {
    console.log('🔐 No access token found - user needs to authenticate');
    
    // Try to return cached events first
    const cachedEvents = localStorage.getItem("lastEvents");
    if (cachedEvents) {
      try {
        const parsedEvents = JSON.parse(cachedEvents);
        console.log('💾 Using cached events (no access token)');
        return Array.isArray(parsedEvents) ? parsedEvents : mockData;
      } catch (parseError) {
        console.error('Error parsing cached events:', parseError);
      }
    }
    
    console.log('📋 No authentication, using mock data');
    return mockData;
  }
};

/**
 * Extract unique locations from events
 */
export const extractLocations = (events) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  
  const locations = events
    .filter(event => event && event.location)
    .map(event => event.location);
  const uniqueLocations = [...new Set(locations)];
  return uniqueLocations.sort();
};

/**
 * Filter events by city
 */
export const filterEventsByCity = (events, city) => {
  if (!city || city === 'See all cities') {
    return events;
  }
  return events.filter(event => event.location === city);
};

/**
 * Limit the number of events returned
 */
export const limitEvents = (events, numberOfEvents) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  return events.slice(0, numberOfEvents);
};
