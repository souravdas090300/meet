const { google } = require("googleapis");

const oauth2 = google.oauth2("v2");
const calendar = google.calendar("v3");

// Use environment variables for sensitive information
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALENDAR_ID = process.env.CALENDAR_ID;
const REDIRECT_URI = "https://souravdas090300.github.io/meet/";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * GET /api/get-auth-url
 * Generate authorization URL for OAuth2 flow
 */
module.exports.getAuthURL = async () => {
  // Scopes we're asking permission for
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    },
    body: JSON.stringify({
      authUrl: authUrl,
    }),
  };
};

/**
 * GET /api/token/{code}
 * Exchange authorization code for access token
 */
module.exports.getAccessToken = async (event) => {
 // Decode authorization code extracted from the URL query
 const code = decodeURIComponent(`${event.pathParameters.code}`);

 return new Promise((resolve, reject) => {
   /**
    *  Exchange authorization code for access token with a "callback" after the exchange,
    *  The callback in this case is an arrow function with the results as parameters: "error" and "response"
    */

   oAuth2Client.getToken(code, (error, response) => {
     if (error) {
       return reject(error);
     }
     return resolve(response);
   });
 })
   .then((results) => {
     // Respond with OAuth token
     return {
       statusCode: 200,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
         'Access-Control-Allow-Methods': 'GET,OPTIONS',
       },
       body: JSON.stringify(results),
     };
   })
   .catch((error) => {
     // Handle error
     return {
       statusCode: 500,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
         'Access-Control-Allow-Methods': 'GET,OPTIONS',
       },
       body: JSON.stringify(error),
     };
   });
};

/**
 * GET /api/get-events/{access_token}
 * Get calendar events using the access token
 */
module.exports.getCalendarEvents = async (event) => {
  const access_token = decodeURIComponent(
    `${event.pathParameters.access_token}`
  );

  oAuth2Client.setCredentials({ access_token });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: CALENDAR_ID,
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  })
    .then((results) => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({ events: results.data.items }),
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify(error),
      };
    });
};