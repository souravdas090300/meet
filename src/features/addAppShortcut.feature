Feature: Add an app shortcut to the home screen

 Scenario: User can install the meet app as a shortcut on their device home screen.
  Given the user is using a compatible browser
  When the user visits the meet app
  Then the user should see an install prompt or be able to install the app
  And the app should be installable as a Progressive Web App
