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