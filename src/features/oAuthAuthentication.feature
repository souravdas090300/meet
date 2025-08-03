Feature: OAuth Authentication with Google

 Scenario: User can log in using Google OAuth
  Given the user is on the main page
  And the user is not authenticated
  When the user clicks the "Login with Google" button
  Then the user should be redirected to Google OAuth
  And the OAuth URL should be valid

 Scenario: User sees logged in state after successful authentication
  Given the user has successfully authenticated with Google
  When the main page loads
  Then the user should see they are logged in
  And the user should see a logout button

 Scenario: User can log out successfully
  Given the user is logged in
  When the user clicks the logout button
  Then the user should be logged out
  And the authentication data should be cleared
  And the user should see a success message

 Scenario: App handles OAuth errors gracefully
  Given the user is on the main page
  And the OAuth service is unavailable
  When the user attempts to log in
  Then the user should see an error message
  And the user should still be on the main page

 Scenario: App handles OAuth redirect with authorization code
  Given the user has been redirected back from Google OAuth
  When the authorization code is processed
  Then the access token should be obtained
  And the access token should be stored

 Scenario: App validates stored access token on load
  Given the user has a stored access token
  When the app loads
  Then the app should check if the user is logged in
  And the user should see the authenticated interface
