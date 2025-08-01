const EVENTS_API_URL = 'https://meet-pi-weld.vercel.app/api/events'; // Replace with your actual API endpoint
const AUTH_SERVER_URL = 'https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev/api'; // Your AWS Lambda auth server URL

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
};

// Check if user is authenticated
export const checkToken = async (accessToken) => {
  const result = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  )
    .then((res) => res.json())
    .catch((error) => error.json());

  return result;
};

// Get OAuth access token
export const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(`${AUTH_SERVER_URL}/get-auth-token/${encodeCode}`);
  const { access_token } = await response.json();
  access_token && localStorage.setItem("access_token", access_token);
  return access_token;
};

// Get authorization URL
export const getAuthURL = async () => {
  const response = await fetch(`${AUTH_SERVER_URL}/get-auth-url`);
  const result = await response.json();
  const { authUrl } = result;
  return authUrl;
};

// Logout function
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("lastEvents");
  localStorage.removeItem("lastEventsTimestamp");
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

// Mock data for development/fallback - Comprehensive event data
const mockEvents = [
  {
    "kind": "calendar#event",
    "etag": "\"3181161784712000\"",
    "id": "4eahs9ghkhrvkld72hogu9ph3e_20200519T140000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:17:46.000Z",
    "updated": "2020-05-27T12:01:32.356Z",
    "summary": "Learn JavaScript",
    "description": "Have you wondered how you can ask Google to show you the list of the top ten must-see places in London? And how Google presents you the list? How can you submit the details of an application? Well, JavaScript is doing these. :) \n\nJavascript offers interactivity to a dull, static website. Come, learn JavaScript with us and make those beautiful websites.",
    "location": "London, UK",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-19T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-19T17:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "4eahs9ghkhrvkld72hogu9ph3e",
    "originalStartTime": {
      "dateTime": "2020-05-19T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "4eahs9ghkhrvkld72hogu9ph3e@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "3qtd6uscq4tsi6gc7nmmtpqlct_20200520T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=M3F0ZDZ1c2NxNHRzaTZnYzdubW10cHFsY3RfMjAyMDA1MjBUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React is Fun",
    "description": "Love HTML, CSS, and JS? Want to become a cool front-end developer? \n\nReact is one of the most popular front-end frameworks. There is a huge number of job openings for React developers in most cities. \n\nJoin us in our free React training sessions and give your career a new direction. ",
    "location": "Berlin, Germany",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-20T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-20T15:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "3qtd6uscq4tsi6gc7nmmtpqlct",
    "originalStartTime": {
      "dateTime": "2020-05-20T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "3qtd6uscq4tsi6gc7nmmtpqlct@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181161784712000\"",
    "id": "4eahs9ghkhrvkld72hogu9ph3e_20200521T140000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MjFUMTQwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:17:46.000Z",
    "updated": "2020-05-27T12:01:32.356Z",
    "summary": "Learn JavaScript",
    "description": "Have you wondered how you can ask Google to show you the list of the top ten must-see places in London? And how Google presents you the list? How can you submit the details of an application? Well, JavaScript is doing these. :) \n\nJavascript offers interactivity to a dull, static website. Come, learn JavaScript with us and make those beautiful websites.",
    "location": "London, UK",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-21T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-21T17:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "4eahs9ghkhrvkld72hogu9ph3e",
    "originalStartTime": {
      "dateTime": "2020-05-21T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "4eahs9ghkhrvkld72hogu9ph3e@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "3qtd6uscq4tsi6gc7nmmtpqlct_20200522T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=M3F0ZDZ1c2NxNHRzaTZnYzdubW10cHFsY3RfMjAyMDA1MjJUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React is Fun",
    "description": "Love HTML, CSS, and JS? Want to become a cool front-end developer? \n\nReact is one of the most popular front-end frameworks. There is a huge number of job openings for React developers in most cities. \n\nJoin us in our free React training sessions and give your career a new direction. ",
    "location": "Berlin, Germany",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-22T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-22T15:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "3qtd6uscq4tsi6gc7nmmtpqlct",
    "originalStartTime": {
      "dateTime": "2020-05-22T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "3qtd6uscq4tsi6gc7nmmtpqlct@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181161784712000\"",
    "id": "4eahs9ghkhrvkld72hogu9ph3e_20200523T140000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MjNUMTQwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:17:46.000Z",
    "updated": "2020-05-27T12:01:32.356Z",
    "summary": "Learn JavaScript",
    "description": "Have you wondered how you can ask Google to show you the list of the top ten must-see places in London? And how Google presents you the list? How can you submit the details of an application? Well, JavaScript is doing these. :) \n\nJavascript offers interactivity to a dull, static website. Come, learn JavaScript with us and make those beautiful websites.",
    "location": "London, UK",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-23T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-23T17:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "4eahs9ghkhrvkld72hogu9ph3e",
    "originalStartTime": {
      "dateTime": "2020-05-23T16:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "4eahs9ghkhrvkld72hogu9ph3e@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "3qtd6uscq4tsi6gc7nmmtpqlct_20200524T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=M3F0ZDZ1c2NxNHRzaTZnYzdubW10cHFsY3RfMjAyMDA1MjRUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React is Fun",
    "description": "Love HTML, CSS, and JS? Want to become a cool front-end developer? \n\nReact is one of the most popular front-end frameworks. There is a huge number of job openings for React developers in most cities. \n\nJoin us in our free React training sessions and give your career a new direction. ",
    "location": "Berlin, Germany",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-24T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "end": {
      "dateTime": "2020-05-24T15:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "recurringEventId": "3qtd6uscq4tsi6gc7nmmtpqlct",
    "originalStartTime": {
      "dateTime": "2020-05-24T14:00:00+02:00",
      "timeZone": "Europe/Berlin"
    },
    "iCalUID": "3qtd6uscq4tsi6gc7nmmtpqlct@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "7cbmsqfircdnb9ic86r5dk3lvo_20200525T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=N2NibXNxZmlyY2RuYjlpYzg2cjVkazNsdm9fMjAyMDA1MjVUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "NodeJS Workshop",
    "description": "Join us for an intensive workshop on Node.js, the popular JavaScript runtime that's revolutionizing server-side development. Learn how to build scalable network applications.",
    "location": "New York, NY, USA",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-25T14:00:00-04:00",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2020-05-25T17:00:00-04:00",
      "timeZone": "America/New_York"
    },
    "recurringEventId": "7cbmsqfircdnb9ic86r5dk3lvo",
    "originalStartTime": {
      "dateTime": "2020-05-25T14:00:00-04:00",
      "timeZone": "America/New_York"
    },
    "iCalUID": "7cbmsqfircdnb9ic86r5dk3lvo@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "8efgh3klmno4pqr7stuv8wxyz1_20200526T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=OGVmZ2gza2xtbm80cHFyN3N0dXY4d3h5ejFfMjAyMDA1MjZUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Python for Beginners",
    "description": "Discover the power of Python! This beginner-friendly workshop will introduce you to one of the most popular programming languages in the world. Perfect for data science, web development, and automation.",
    "location": "San Francisco, CA, USA",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-26T10:00:00-07:00",
      "timeZone": "America/Los_Angeles"
    },
    "end": {
      "dateTime": "2020-05-26T13:00:00-07:00",
      "timeZone": "America/Los_Angeles"
    },
    "recurringEventId": "8efgh3klmno4pqr7stuv8wxyz1",
    "originalStartTime": {
      "dateTime": "2020-05-26T10:00:00-07:00",
      "timeZone": "America/Los_Angeles"
    },
    "iCalUID": "8efgh3klmno4pqr7stuv8wxyz1@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "9abcd2efgh5ijkl8mnop1qrst4_20200527T120000Z",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=OWFiY2QyZWZnaDVpamtsOG1ub3AxcXJzdDRfMjAyMDA1MjdUMTIwMDAwWiB0ZXN0LmNhcmVlckZvdW5kcnlAZ21haWwuY29t",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Data Science Meetup",
    "description": "Join data enthusiasts from around the world! Learn about machine learning, statistical analysis, and data visualization. Network with professionals and discover new career opportunities in data science.",
    "location": "Sydney, NSW, Australia",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-27T18:00:00+10:00",
      "timeZone": "Australia/Sydney"
    },
    "end": {
      "dateTime": "2020-05-27T21:00:00+10:00",
      "timeZone": "Australia/Sydney"
    },
    "recurringEventId": "9abcd2efgh5ijkl8mnop1qrst4",
    "originalStartTime": {
      "dateTime": "2020-05-27T18:00:00+10:00",
      "timeZone": "Australia/Sydney"
    },
    "iCalUID": "9abcd2efgh5ijkl8mnop1qrst4@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "1xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=MXh5ejd1dncyYWJjOGRlZjNnaGk5amtsNG1ub18yMDIwMDUyOFQxMjAwMDBaIHRlc3QuY2FyZWVyRm91bmRyeUBnbWFpbC5jb20",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "CSS Grid Workshop",
    "description": "Master modern CSS layout with CSS Grid! Learn how to create responsive, flexible layouts that work perfectly across all devices. From basic concepts to advanced techniques.",
    "location": "Toronto, ON, Canada",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-28T13:00:00-04:00",
      "timeZone": "America/Toronto"
    },
    "end": {
      "dateTime": "2020-05-28T16:00:00-04:00",
      "timeZone": "America/Toronto"
    },
    "iCalUID": "1xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  }
];

/**
 * Fetch events from API or return cached data when offline
 */
export const getEvents = async () => {
  // Check if user is offline and return cached events
  if (!navigator.onLine) {
    const cachedEvents = localStorage.getItem("lastEvents");
    if (cachedEvents) {
      console.log('Loading events from cache (offline mode)');
      try {
        const parsedEvents = JSON.parse(cachedEvents);
        return Array.isArray(parsedEvents) ? parsedEvents : mockEvents;
      } catch (error) {
        console.error('Error parsing cached events:', error);
        return mockEvents;
      }
    }
    // If no cached events, return mock data as fallback
    console.log('No cached events found, using mock data');
    return mockEvents;
  }

  // Check if there's an authorization code in the URL
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (code) {
    removeQuery();
    const token = await getToken(code);
    return await getEventsFromAPI(token);
  }

  // Check if we have a stored access token
  const token = localStorage.getItem("access_token");
  
  if (token) {
    const tokenCheck = await checkToken(token);
    if (tokenCheck.error) {
      // Token is invalid, remove it and redirect to OAuth
      localStorage.removeItem("access_token");
      return await redirectToOAuth();
    } else {
      // Token is valid, fetch events
      return await getEventsFromAPI(token);
    }
  } else {
    // No token, redirect to OAuth
    return await redirectToOAuth();
  }
};

// Helper function to redirect to OAuth
const redirectToOAuth = async () => {
  // For development, return mock data and show a message
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Development mode: Using mock data. In production, user would be redirected to OAuth.');
    return mockEvents;
  }
  
  // In production, redirect to OAuth
  const authUrl = await getAuthURL();
  window.location.href = authUrl;
  return [];
};

// Helper function to fetch events from Google Calendar API
const getEventsFromAPI = async (accessToken) => {
  try {
    const response = await fetch(`${AUTH_SERVER_URL}/get-calendar-events/${accessToken}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    // Cache the events in localStorage for offline use
    try {
      localStorage.setItem("lastEvents", JSON.stringify(events));
      localStorage.setItem("lastEventsTimestamp", Date.now().toString());
      console.log('Real events cached for offline use');
    } catch (storageError) {
      console.warn('Failed to cache events:', storageError);
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching events from Google Calendar API:', error);
    
    // Try to return cached events if API fails
    const cachedEvents = localStorage.getItem("lastEvents");
    if (cachedEvents) {
      console.log('API failed, loading events from cache');
      try {
        const parsedEvents = JSON.parse(cachedEvents);
        return Array.isArray(parsedEvents) ? parsedEvents : mockEvents;
      } catch (parseError) {
        console.error('Error parsing cached events:', parseError);
        return mockEvents;
      }
    }
    
    // Return mock data as final fallback
    console.log('API failed and no cache available, using mock data');
    return mockEvents;
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
