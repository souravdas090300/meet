import mockData from './mock-data';

/**
 * This function takes an events array, then uses map to create a new array with only locations.
 * It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.
 * The Set will remove all duplicates from the array.
 */
export const extractLocations = (events) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  
  const extractedLocations = events
    .filter(event => event && event.location) // Filter out events without location
    .map((event) => event.location)
    .filter(location => location && typeof location === 'string'); // Filter out invalid locations
    
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 * This function will fetch the list of all events
 */

// ...existing code...

export const getEvents = async () => {
  // Always return mock data for localhost
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  // If offline, check localStorage first
  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    return events ? JSON.parse(events) : mockData;
  }

  try {
    const token = await getAccessToken();

    if (token) {
      removeQuery();
      
      // Verify token one more time before using it for API calls
      const tokenCheck = await checkToken(token);
      if (tokenCheck.error) {
        console.log('Token invalid during events fetch, clearing and retrying...');
        localStorage.removeItem("access_token");
        throw new Error('Token verification failed');
      }
      
      // Use direct API Gateway URL (CORS is now configured)
      const url = `https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev/api/get-events/${token}`;
      const result = await fetch(url);
      
      if (!result.ok) {
        if (result.status === 401) {
          // Unauthorized - token might be expired
          console.log('Unauthorized response, clearing token...');
          localStorage.removeItem("access_token");
          throw new Error('Token expired or invalid');
        }
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      
      const data = await result.json();
      let events = data.events || data; // Handle different response formats
      
      // Ensure events is an array and filter out invalid events
      if (events && Array.isArray(events)) {
        // Filter out events without required properties and add default location if missing
        events = events.map(event => ({
          ...event,
          location: event.location || 'Location not specified',
          summary: event.summary || 'No title',
          id: event.id || Math.random().toString(36).substr(2, 9)
        }));
        
        localStorage.setItem("lastEvents", JSON.stringify(events));
        console.log(`Successfully fetched ${events.length} events from Google Calendar`);
        return events;
      }
    }
  } catch (error) {
    console.log('Error fetching events from API, falling back to mock data:', error);
  }

  // Fallback to mock data in all cases
  console.log('Using mock data');
  return mockData;
};

// ...existing code...

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  
  // If we have a token, verify it's still valid
  if (accessToken) {
    try {
      const tokenCheck = await checkToken(accessToken);
      
      // If token is valid and no errors, return it
      if (!tokenCheck.error) {
        return accessToken;
      } else {
        console.log('Token verification failed:', tokenCheck.error);
        // Remove invalid token
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Remove potentially corrupted token
      localStorage.removeItem("access_token");
    }
  }

  // No valid token found, check for authorization code
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  
  if (!code) {
    // No authorization code, redirect to OAuth
    try {
      // Use direct API Gateway URL (CORS is now configured)
      const results = await fetch("https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url");
      
      if (!results.ok) {
        throw new Error(`HTTP error! status: ${results.status}`);
      }
      
      const data = await results.json();
      const authUrl = data.authUrl;
      
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      return null;
    }
  }
  
  // We have an authorization code, exchange it for a token
  return code && getToken(code);
};

// ...existing code...

const getToken = async (code) => {
  try {
    const encodeCode = encodeURIComponent(code);
    // Use direct API Gateway URL (CORS is now configured)
    const response = await fetch(`https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if there's an error in the response
    if (data.error) {
      throw new Error(`Token exchange failed: ${data.error}`);
    }
    
    const access_token = data.access_token;

    if (access_token) {
      // Verify the new token before storing it
      const tokenCheck = await checkToken(access_token);
      
      if (!tokenCheck.error) {
        localStorage.setItem("access_token", access_token);
        console.log('New access token stored and verified');
        return access_token;
      } else {
        throw new Error(`Token verification failed: ${tokenCheck.error}`);
      }
    }
    
    throw new Error('No access token received');
  } catch (error) {
    console.error('Error getting token:', error);
    // Clear any authorization code from URL on error
    removeQuery();
    return null;
  }
};





/**
 * This function takes an access token and sends a request to the Google Calendar API
 * to verify that it's valid.
 */
const checkToken = async (accessToken) => {
  try {
    // Use the current Google OAuth2 tokeninfo endpoint
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    );
    
    if (!response.ok) {
      // If the response is not OK, the token is likely invalid
      return { error: 'Invalid token' };
    }
    
    const result = await response.json();
    
    // Check if the token has an error or is expired
    if (result.error) {
      return { error: result.error };
    }
    
    // Check if the token is for the correct client ID (optional security check)
    // You can uncomment this if you want to verify the client ID
    // const expectedClientId = "961599722416-tiplg88mr59klc33o1rp27vhp3goee8t.apps.googleusercontent.com";
    // if (result.aud !== expectedClientId) {
    //   return { error: 'Token client ID mismatch' };
    // }
    
    // Check if the token has the required scope
    if (result.scope && !result.scope.includes('calendar.readonly')) {
      return { error: 'Insufficient scope' };
    }
    
    return result;
  } catch (error) {
    console.error('Error checking token:', error);
    return { error: 'Token verification failed' };
  }
};



/**
 * This function removes the code from the URL once it's been used
 * to get the access token.
 */
const removeQuery = () => {
  if (window.history.pushState && window.location.pathname) {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};
