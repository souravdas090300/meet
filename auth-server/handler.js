'use strict';


const { google } = require("googleapis");
const calendar = google.calendar("v3");

const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;

// Primary redirect URI for production
const REDIRECT_URI = "https://souravdas090300.github.io/meet/";

const oAuth2Client = new google.auth.OAuth2(
 CLIENT_ID,
 CLIENT_SECRET,
 REDIRECT_URI
);


module.exports.getAuthURL = async (event) => {
 /**
  * Generate OAuth URL - supports environment switching via query parameter
  * ?env=github for GitHub Pages deployment (default)
  * ?env=local for local development
  * ?env=test for local testing
  * Default: GitHub Pages
  */
 
 let redirectUri = REDIRECT_URI; // Default to GitHub Pages
 
 // Check for environment override
 const queryParams = event?.queryStringParameters || {};
 if (queryParams.env) {
   switch (queryParams.env.toLowerCase()) {
     case 'github':
     case 'production':
       redirectUri = "https://souravdas090300.github.io/meet/";
       break;
     case 'local':
       redirectUri = "http://localhost:3000/";
       break;
     case 'test':
       redirectUri = "http://127.0.0.1:3000/";
       break;
     // Default remains GitHub Pages
   }
 }
 
 // Create OAuth client with the selected redirect URI
 const oAuth2ClientForRequest = new google.auth.OAuth2(
   CLIENT_ID,
   CLIENT_SECRET,
   redirectUri
 );
 
 const authUrl = oAuth2ClientForRequest.generateAuthUrl({
   access_type: "offline",
   scope: SCOPES,
 });

 return {
   statusCode: 200,
   headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true,
   },
   body: JSON.stringify({
     authUrl,
     redirectUri,
   }),
 };
};

module.exports.getAccessToken = async (event) => {
 // Decode authorization code extracted from the URL query
 const code = decodeURIComponent(`${event.pathParameters.code}`);


 return new Promise((resolve, reject) => {
   /**
    *  Exchange authorization code for access token with a “callback” after the exchange,
    *  The callback in this case is an arrow function with the results as parameters: “error” and “response”
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
         'Access-Control-Allow-Credentials': true,
       },
       body: JSON.stringify(results),
     };
   })
   .catch((error) => {
     // Handle error
     return {
       statusCode: 500,
       body: JSON.stringify(error),
     };
   });
};

module.exports.getCalendarEvents = async (event) => {
  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ events: results.data.items }),
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(error),
      };
    });
};
