Feature: Display charts visualizing event details

 Scenario: Show a chart with the number of upcoming events in each city.
  Given the user has loaded event data
  When the user views the main page
  Then the user should see a chart showing the number of events per city
  And the user should see a chart showing event genres distribution
