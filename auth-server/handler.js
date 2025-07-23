const https = require("https");
const { URLSearchParams } = require("url");

// Use environment variables for sensitive information
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALENDAR_ID = process.env.CALENDAR_ID;
const REDIRECT_URI = "https://souravdas090300.github.io/meet/";

// Helper function to make HTTPS requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          resolve(data);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/**
 * GET /api/get-auth-url
 * Generate authorization URL for OAuth2 flow
 */
module.exports.getAuthURL = async () => {
  try {
    const scopes = [
      "https://www.googleapis.com/auth/calendar.readonly"
    ];

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `access_type=offline&` +
      `scope=${encodeURIComponent(scopes.join(" "))}&` +
      `response_type=code&` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

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
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
    };
  }
};

/**
 * GET /api/token/{code}
 * Exchange authorization code for access token
 */
module.exports.getAccessToken = async (event) => {
  try {
    const code = decodeURIComponent(event.pathParameters.code);

    const postData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }).toString();

    const options = {
      hostname: "oauth2.googleapis.com",
      port: 443,
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const tokenData = await makeRequest(options, postData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
    };
  }
};

/**
 * GET /api/get-events/{access_token}
 * Get calendar events using the access token
 */
module.exports.getCalendarEvents = async (event) => {
  try {
    const access_token = decodeURIComponent(event.pathParameters.access_token);

    const options = {
      hostname: "www.googleapis.com",
      port: 443,
      path: `/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?timeMin=${encodeURIComponent(new Date().toISOString())}&singleEvents=true&orderBy=startTime`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const eventsData = await makeRequest(options);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({ events: eventsData.items }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
    };
  }
};