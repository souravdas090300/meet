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
  try {
    const encodeCode = encodeURIComponent(code);
    const response = await fetch(`${AUTH_SERVER_URL}/api/token/${encodeCode}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }
    
    const { access_token } = await response.json();
    
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    
    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Get authorization URL
export const getAuthURL = async () => {
  try {
    const response = await fetch(`${AUTH_SERVER_URL}/api/get-auth-url`);
    
    if (!response.ok) {
      throw new Error(`Failed to get auth URL: ${response.status}`);
    }
    
    const result = await response.json();
    const { authUrl } = result;
    
    return authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
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
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "11xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Python Django Workshop",
    "description": "Build powerful web applications with Django framework. Learn models, views, templates, and deployment strategies.",
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
      "dateTime": "2020-05-29T10:00:00+10:00",
      "timeZone": "Australia/Sydney"
    },
    "end": {
      "dateTime": "2020-05-29T17:00:00+10:00",
      "timeZone": "Australia/Sydney"
    },
    "iCalUID": "11xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "12xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "MongoDB Database Design",
    "description": "Learn NoSQL database design with MongoDB. Understand collections, documents, indexing, and performance optimization.",
    "location": "Mumbai, India",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-05-30T14:00:00+05:30",
      "timeZone": "Asia/Kolkata"
    },
    "end": {
      "dateTime": "2020-05-30T18:00:00+05:30",
      "timeZone": "Asia/Kolkata"
    },
    "iCalUID": "12xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "13xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React Advanced Patterns",
    "description": "Dive deep into advanced React patterns: hooks, context, render props, higher-order components, and performance optimization.",
    "location": "Tokyo, Japan",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-01T15:00:00+09:00",
      "timeZone": "Asia/Tokyo"
    },
    "end": {
      "dateTime": "2020-06-01T18:00:00+09:00",
      "timeZone": "Asia/Tokyo"
    },
    "iCalUID": "13xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "14xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Node.js API Development",
    "description": "Build robust RESTful APIs with Node.js and Express. Learn authentication, middleware, error handling, and testing.",
    "location": "São Paulo, Brazil",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-02T10:00:00-03:00",
      "timeZone": "America/Sao_Paulo"
    },
    "end": {
      "dateTime": "2020-06-02T17:00:00-03:00",
      "timeZone": "America/Sao_Paulo"
    },
    "iCalUID": "14xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "15xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Angular Framework Workshop",
    "description": "Master Angular framework from basics to advanced concepts. Components, services, routing, and testing strategies.",
    "location": "Stockholm, Sweden",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-03T09:00:00+02:00",
      "timeZone": "Europe/Stockholm"
    },
    "end": {
      "dateTime": "2020-06-03T16:00:00+02:00",
      "timeZone": "Europe/Stockholm"
    },
    "iCalUID": "15xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "16xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Vue.js Complete Guide",
    "description": "Learn Vue.js from scratch. Reactive data, components, Vuex state management, and building single-page applications.",
    "location": "Barcelona, Spain",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-04T11:00:00+02:00",
      "timeZone": "Europe/Madrid"
    },
    "end": {
      "dateTime": "2020-06-04T18:00:00+02:00",
      "timeZone": "Europe/Madrid"
    },
    "iCalUID": "16xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "17xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "DevOps with Docker",
    "description": "Learn containerization with Docker. Build, deploy, and manage applications using containers and orchestration.",
    "location": "Amsterdam, Netherlands",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-05T10:00:00+02:00",
      "timeZone": "Europe/Amsterdam"
    },
    "end": {
      "dateTime": "2020-06-05T17:00:00+02:00",
      "timeZone": "Europe/Amsterdam"
    },
    "iCalUID": "17xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "18xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "JavaScript ES6+ Features",
    "description": "Master modern JavaScript features: arrow functions, destructuring, modules, async/await, and more.",
    "location": "Zurich, Switzerland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-06T14:00:00+02:00",
      "timeZone": "Europe/Zurich"
    },
    "end": {
      "dateTime": "2020-06-06T18:00:00+02:00",
      "timeZone": "Europe/Zurich"
    },
    "iCalUID": "18xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "19xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "GraphQL API Design",
    "description": "Learn GraphQL for building efficient APIs. Queries, mutations, subscriptions, and schema design best practices.",
    "location": "Vienna, Austria",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-07T13:00:00+02:00",
      "timeZone": "Europe/Vienna"
    },
    "end": {
      "dateTime": "2020-06-07T17:00:00+02:00",
      "timeZone": "Europe/Vienna"
    },
    "iCalUID": "19xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "20xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "TypeScript for JavaScript Developers",
    "description": "Add static typing to JavaScript with TypeScript. Interfaces, generics, decorators, and advanced type features.",
    "location": "Copenhagen, Denmark",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-08T10:00:00+02:00",
      "timeZone": "Europe/Copenhagen"
    },
    "end": {
      "dateTime": "2020-06-08T16:00:00+02:00",
      "timeZone": "Europe/Copenhagen"
    },
    "iCalUID": "20xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "21xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React Native Mobile Development",
    "description": "Build cross-platform mobile apps with React Native. Navigation, state management, and native modules.",
    "location": "Oslo, Norway",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-09T09:00:00+02:00",
      "timeZone": "Europe/Oslo"
    },
    "end": {
      "dateTime": "2020-06-09T17:00:00+02:00",
      "timeZone": "Europe/Oslo"
    },
    "iCalUID": "21xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "22xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Kubernetes Orchestration",
    "description": "Master Kubernetes for container orchestration. Pods, services, deployments, and cluster management.",
    "location": "Helsinki, Finland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-10T11:00:00+03:00",
      "timeZone": "Europe/Helsinki"
    },
    "end": {
      "dateTime": "2020-06-10T18:00:00+03:00",
      "timeZone": "Europe/Helsinki"
    },
    "iCalUID": "22xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "23xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "jQuery Advanced Techniques",
    "description": "Advanced jQuery techniques for dynamic web interfaces. Plugins, animations, AJAX, and performance optimization.",
    "location": "Brussels, Belgium",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-11T14:00:00+02:00",
      "timeZone": "Europe/Brussels"
    },
    "end": {
      "dateTime": "2020-06-11T18:00:00+02:00",
      "timeZone": "Europe/Brussels"
    },
    "iCalUID": "23xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "24xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Web Security Best Practices",
    "description": "Learn web security fundamentals. HTTPS, authentication, authorization, OWASP top 10, and secure coding practices.",
    "location": "Prague, Czech Republic",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-12T10:00:00+02:00",
      "timeZone": "Europe/Prague"
    },
    "end": {
      "dateTime": "2020-06-12T17:00:00+02:00",
      "timeZone": "Europe/Prague"
    },
    "iCalUID": "24xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "25xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Progressive Web Apps",
    "description": "Build PWAs with modern web technologies. Service workers, offline functionality, app manifests, and native-like experiences.",
    "location": "Budapest, Hungary",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-13T13:00:00+02:00",
      "timeZone": "Europe/Budapest"
    },
    "end": {
      "dateTime": "2020-06-13T18:00:00+02:00",
      "timeZone": "Europe/Budapest"
    },
    "iCalUID": "25xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "26xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Microservices Architecture",
    "description": "Design and build microservices architectures. API gateways, service discovery, distributed systems patterns.",
    "location": "Warsaw, Poland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-14T09:00:00+02:00",
      "timeZone": "Europe/Warsaw"
    },
    "end": {
      "dateTime": "2020-06-14T17:00:00+02:00",
      "timeZone": "Europe/Warsaw"
    },
    "iCalUID": "26xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "27xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Machine Learning with JavaScript",
    "description": "Explore ML with JavaScript using TensorFlow.js. Neural networks, training models, and browser-based AI applications.",
    "location": "Lisbon, Portugal",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-15T11:00:00+01:00",
      "timeZone": "Europe/Lisbon"
    },
    "end": {
      "dateTime": "2020-06-15T18:00:00+01:00",
      "timeZone": "Europe/Lisbon"
    },
    "iCalUID": "27xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "28xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Blockchain Development",
    "description": "Introduction to blockchain development. Smart contracts, Web3, DeFi protocols, and decentralized applications.",
    "location": "Athens, Greece",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-16T14:00:00+03:00",
      "timeZone": "Europe/Athens"
    },
    "end": {
      "dateTime": "2020-06-16T19:00:00+03:00",
      "timeZone": "Europe/Athens"
    },
    "iCalUID": "28xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "29xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Serverless Architecture with AWS",
    "description": "Build serverless applications with AWS Lambda, API Gateway, DynamoDB, and other AWS services.",
    "location": "Dublin, Ireland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-17T10:00:00+01:00",
      "timeZone": "Europe/Dublin"
    },
    "end": {
      "dateTime": "2020-06-17T17:00:00+01:00",
      "timeZone": "Europe/Dublin"
    },
    "iCalUID": "29xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "30xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Advanced CSS Animations",
    "description": "Create stunning web animations with CSS. Keyframes, transforms, transitions, and performance best practices.",
    "location": "Edinburgh, Scotland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-18T13:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "end": {
      "dateTime": "2020-06-18T18:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "iCalUID": "30xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "31xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "React Testing Strategies",
    "description": "Comprehensive testing for React applications. Unit tests, integration tests, end-to-end testing with Jest and Cypress.",
    "location": "Cardiff, Wales",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-19T09:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "end": {
      "dateTime": "2020-06-19T16:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "iCalUID": "31xyz7uvw2abc8def3ghi9jkl4mno@google.com",
    "sequence": 0,
    "reminders": {
      "useDefault": true
    },
    "eventType": "default"
  },
  {
    "kind": "calendar#event",
    "etag": "\"3181159875584000\"",
    "id": "32xyz7uvw2abc8def3ghi9jkl4mno",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event",
    "created": "2020-05-19T19:14:30.000Z",
    "updated": "2020-05-27T11:45:37.792Z",
    "summary": "Full-Stack JavaScript Capstone",
    "description": "Build a complete full-stack application using the MERN stack. From concept to deployment with best practices.",
    "location": "Belfast, Northern Ireland",
    "creator": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "organizer": {
      "email": "fullstack-webdev@careerfoundry.com",
      "displayName": "CareerFoundry"
    },
    "start": {
      "dateTime": "2020-06-20T11:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "end": {
      "dateTime": "2020-06-20T18:00:00+01:00",
      "timeZone": "Europe/London"
    },
    "iCalUID": "32xyz7uvw2abc8def3ghi9jkl4mno@google.com",
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
  console.log('🚀 getEvents called');
  
  // Check if user is offline and return cached events
  if (!navigator.onLine) {
    console.log('📵 User is offline');
    const cachedEvents = localStorage.getItem("lastEvents");
    if (cachedEvents) {
      console.log('💾 Loading events from cache (offline mode)');
      try {
        const parsedEvents = JSON.parse(cachedEvents);
        return Array.isArray(parsedEvents) ? parsedEvents : mockEvents;
      } catch (error) {
        console.error('Error parsing cached events:', error);
        return mockEvents;
      }
    }
    // If no cached events, return mock data as fallback
    console.log('📂 No cached events found, using mock data (offline)');
    return mockEvents;
  }

  console.log('🌐 User is online');
  
  // Check if there's an authorization code in the URL
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (code) {
    console.log('🔑 Authorization code found in URL');
    removeQuery();
    const token = await getToken(code);
    return await getEventsFromAPI(token);
  }

  // Check if we have a stored access token
  const token = localStorage.getItem("access_token");
  console.log('🔍 Checking for stored token:', token ? 'Found' : 'Not found');
  
  if (token) {
    console.log('✅ Token found, checking validity');
    const tokenCheck = await checkToken(token);
    if (tokenCheck.error) {
      // Token is invalid, remove it and redirect to OAuth
      console.log('❌ Token is invalid, removing and redirecting to OAuth');
      localStorage.removeItem("access_token");
      return await redirectToOAuth();
    } else {
      // Token is valid, fetch events
      console.log('✅ Token is valid, fetching events from API');
      return await getEventsFromAPI(token);
    }
  } else {
    // No token, redirect to OAuth
    console.log('🚫 No token found, redirecting to OAuth');
    return await redirectToOAuth();
  }
};

// Helper function to redirect to OAuth
const redirectToOAuth = async () => {
  try {
    console.log('Initiating OAuth flow...');
    const authUrl = await getAuthURL();
    window.location.href = authUrl;
    return []; // Return empty array while redirecting
  } catch (error) {
    console.error('Error during OAuth redirect:', error);
    // Fallback to mock data if OAuth fails
    console.log('OAuth failed, falling back to mock data');
    return mockEvents;
  }
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
