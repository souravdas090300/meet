'use strict';

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;

// Ensure trailing slash is present (matches Google Cloud Console)
const REDIRECT_URI = "https://souravdas090300.github.io/meet/";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI  // Use the exact URI registered in Google Cloud Console
);

module.exports.getAuthURL = async () => {
  // Always return CORS headers, even on errors
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Credentials': false,
  };

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      redirect_uri: REDIRECT_URI  // Explicitly set to ensure consistency
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        authUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to generate auth URL",
        details: error.message,
      }),
    };
  }
};

module.exports.getAccessToken = async (event) => {
  // Always return CORS headers, even on errors
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Credentials': false,
  };

  try {
    console.log('getAccessToken called with event:', JSON.stringify(event, null, 2));
    
    const code = decodeURIComponent(`${event.pathParameters.code}`);
    console.log('Processing OAuth code:', code.substring(0, 20) + '...');

    return new Promise((resolve, reject) => {
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('OAuth2 getToken error:', err);
          console.error('Error details:', {
            message: err.message,
            code: err.code,
            status: err.status
          });
          
          return resolve({
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: "Failed to get access token",
              details: err.message,
              errorCode: err.code || 'unknown'
            }),
          });
        }

        console.log('Successfully obtained token');
        console.log('Token details:', {
          hasAccessToken: !!token.access_token,
          hasRefreshToken: !!token.refresh_token,
          tokenType: token.token_type,
          expiryDate: token.expiry_date
        });

        resolve({
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expiry_date: token.expiry_date,
            token_type: token.token_type,
          }),
        });
      });
    });
  } catch (error) {
    console.error('getAccessToken sync error:', error);
    // Catch any synchronous errors and return with CORS headers
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};

module.exports.getCalendarEvents = async (event) => {
  // Always return CORS headers, even on errors
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Credentials': false,
  };

  try {
    const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
    oAuth2Client.setCredentials({ access_token });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      htmlLink: event.htmlLink,
      status: event.status,
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        events,
      }),
    };
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to fetch calendar events",
        details: err.message,
      }),
    };
  }
};

module.exports.refreshAccessToken = async (event) => {
  const refresh_token = decodeURIComponent(`${event.pathParameters.refresh_token}`);
  oAuth2Client.setCredentials({ refresh_token });

  return new Promise((resolve, reject) => {
    oAuth2Client.refreshAccessToken((err, tokens) => {
      if (err) {
        return reject({
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
            'Access-Control-Allow-Credentials': false,
          },
          body: JSON.stringify({
            error: "Failed to refresh access token",
            details: err.message,
          }),
        });
      }

      resolve({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
          'Access-Control-Allow-Credentials': false,
        },
        body: JSON.stringify({
          access_token: tokens.access_token,
          expiry_date: tokens.expiry_date,
        }),
      });
    });
  });
};

module.exports.authCallback = async (event) => {
  const code = event.queryStringParameters.code;
  
  if (!code) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html',
      },
      body: '<h1>Error: No authorization code provided</h1>',
    };
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head>
            <title>Authorization Successful</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .success { color: green; }
            </style>
          </head>
          <body>
            <h1 class="success">Authorization Successful!</h1>
            <p>You can now close this window and return to the application.</p>
          </body>
        </html>
      `,
    };
  } catch (err) {
    console.error('Error during OAuth callback:', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head>
            <title>Authorization Failed</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <h1 class="error">Authorization Failed</h1>
            <p>${err.message}</p>
          </body>
        </html>
      `,
    };
  }
};

// Handle CORS preflight OPTIONS requests
module.exports.options = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Credentials': false,
    },
    body: '',
  };
};

// Handle CORS preflight for all endpoints
module.exports.corsHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,Accept,Origin',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Credentials': false,
    },
    body: '',
  };
};