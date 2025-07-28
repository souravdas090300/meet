Feature: Specify Number of Events

Scenario: When user hasn't specified a number, 32 is the default number
  Given user hasn't specified or filtered the number of events
  When the user opens the app
  Then the user should see 32 events by default

Scenario: User can change the number of events they want to see
  Given the main page is open
  When the user changes the number of events to 10
  Then the user should see exactly 10 events displayed
