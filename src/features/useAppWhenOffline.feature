Feature: Use the app when offline

 Scenario: Show cached data when there's no internet connection.
  Given the user has no internet connection
  When the user opens the app
  Then the user should see cached events data
  And the user should see a warning message about being offline

 Scenario: Show error when user changes search settings while offline.
  Given the user is offline
  When the user changes the city or number of events
  Then the user should see the cached events
  And the user should see a warning about limited functionality offline
