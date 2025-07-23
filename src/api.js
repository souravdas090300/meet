import mockData from './mock-data';

/**
 * This function takes an events array, then uses map to create a new array with only locations.
 * It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.
 * The Set will remove all duplicates from the array.
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
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
      const url = `https://cors-anywhere.herokuapp.com/https://ym392rf9u2.execute-api.eu-central-1.amazonaws.com/dev/api/get-events/${token}`;
      const result = await fetch(url);
      const { events } = await result.json();
      if (events) {
        localStorage.setItem("lastEvents", JSON.stringify(events));
        return events;
      }
    }
  } catch (error) {
    console.log('Error fetching events from API, falling back to mock data:', error);
  }

  // Fallback to mock data in all cases
  return mockData;
};

// ...existing code...

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const results = await fetch("https://cors-anywhere.herokuapp.com/https://ym392rf9u2.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url");
      const { authUrl } = await results.json();
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};

// ...existing code...

const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch(`https://cors-anywhere.herokuapp.com/https://ym392rf9u2.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeCode}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => error);

  access_token && localStorage.setItem("access_token", access_token);

  return access_token;
};





/**
 * This function takes an access token and sends a request to the Google Calendar API
 * to verify that it's valid.
 */
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
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
