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
export const getEvents = async () => {
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    return events?JSON.parse(events):[];
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url = `https://YOUR_SERVERLESS_API_URL/api/get-events/${token}`;
    const result = await fetch(url);
    const { events } = await result.json();
    if (events) {
      localStorage.setItem("lastEvents", JSON.stringify(events));
      return events;
    }
  }

  return mockData;
};

/**
 * This function will check whether there's a path, then build the URL with the current path (or build without one if there's no path)
 * and send a GET request to the endpoint.
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const results = await fetch("https://YOUR_SERVERLESS_API_URL/api/get-auth-url");
      const { authUrl } = await results.json();
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
};

/**
 * This function takes an access token and sends a request to the Google Calendar API
 * to verify that it's valid.
 */
const checkToken = async (accessToken) => {
  const result = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  )
  .then((res) => res.json())
  .catch((error) => error.json());

  return result;
};

/**
 * This function takes the authorization code and sends it to your server 
 * to be exchanged for an access token.
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch(`https://YOUR_SERVERLESS_API_URL/api/token/${encodeCode}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => error);

  access_token && localStorage.setItem("access_token", access_token);

  return access_token;
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
