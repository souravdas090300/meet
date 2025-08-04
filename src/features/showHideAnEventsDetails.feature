Feature: Show/Hide Event Details

Scenario: An event element is collapsed by default
  Given user hasn't searched for any city
  When the user opens the app
  Then the user should see a list of events
  And all event details should be hidden

Scenario: User can expand an event to see its details
  Given the main page is open
  When the user clicks on "Show details" button for an event
  Then the event details should be displayed

Scenario: User can collapse an event to hide its details
  Given the user has expanded an event's details
  When the user clicks on "Hide details" button
  Then the event details should be hidden
