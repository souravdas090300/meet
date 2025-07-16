# Meet App

A React-based progressive web application for event management and discovery. This app allows users to find and view events in their city, with offline functionality and data visualization features.

## Project Overview

The Meet app is designed to help users discover events happening in their area. Built with React and using serverless functions, it provides a seamless experience for event discovery and management.

## Features

### User Stories

#### Feature 2: Show/Hide Event Details
**As a** user,  
**I should be able to** show and hide event details  
**So that** I can get more information about events that interest me while keeping the interface clean and uncluttered.

#### Feature 3: Specify Number of Events
**As a** user,  
**I should be able to** specify the number of events displayed  
**So that** I can control how many events I see at once and customize my viewing experience.

#### Feature 4: Use the App When Offline
**As a** user,  
**I should be able to** use the app when offline  
**So that** I can access event information even when I don't have an internet connection.

#### Feature 5: Add an App Shortcut to the Home Screen
**As a** user,  
**I should be able to** add an app shortcut to my device's home screen  
**So that** I can quickly access the app without having to open a browser and navigate to the website.

#### Feature 6: Display Charts Visualizing Event Details
**As a** user,  
**I should be able to** view charts that visualize event details  
**So that** I can quickly understand event patterns and trends in my area.

### Scenarios (Gherkin Syntax)

#### Feature 2: Show/Hide Event Details

**Scenario 1:** Event details are hidden by default
```gherkin
Given the user has opened the app
When the user views the list of events
Then each event should display basic information only
And detailed information should be hidden
```

**Scenario 2:** User can expand event details
```gherkin
Given the user is viewing a list of events
When the user clicks on an event's "Show Details" button
Then the event should expand to show detailed information
And the button should change to "Hide Details"
```

**Scenario 3:** User can collapse event details
```gherkin
Given an event's details are currently expanded
When the user clicks on the "Hide Details" button
Then the event details should be hidden
And only basic event information should be visible
```

#### Feature 3: Specify Number of Events

**Scenario 1:** Default number of events is displayed
```gherkin
Given the user has not specified a number of events
When the user opens the app
Then 32 events should be displayed by default
```

**Scenario 2:** User can change the number of events displayed
```gherkin
Given the user is on the main events page
When the user enters a number in the "Number of Events" input field
Then the app should display that specified number of events
```

**Scenario 3:** User enters invalid number
```gherkin
Given the user is on the main events page
When the user enters an invalid number (negative, zero, or non-numeric)
Then the app should display an error message
And revert to the previous valid number or default
```

#### Feature 4: Use the App When Offline

**Scenario 1:** Show cached data when offline
```gherkin
Given the user has previously loaded events while online
When the user opens the app without an internet connection
Then the app should display the cached event data
And show an indicator that the user is offline
```

**Scenario 2:** Show error when no cached data available offline
```gherkin
Given the user has never used the app before
When the user opens the app without an internet connection
Then the app should display an error message
And inform the user that an internet connection is required for first use
```

**Scenario 3:** Sync data when connection is restored
```gherkin
Given the user was using the app offline
When the internet connection is restored
Then the app should automatically sync with the server
And update the event data with the latest information
```

#### Feature 5: Add an App Shortcut to the Home Screen

**Scenario 1:** User can install the app as PWA
```gherkin
Given the user is using a compatible browser
When the user visits the meet app
Then the browser should show an "Add to Home Screen" option
```

**Scenario 2:** App shortcut is added to home screen
```gherkin
Given the user has chosen to add the app to their home screen
When the installation process is complete
Then a shortcut icon should appear on the user's home screen
And clicking it should open the app directly
```

**Scenario 3:** App works independently from browser
```gherkin
Given the user has installed the app on their home screen
When the user opens the app from the home screen shortcut
Then the app should open in standalone mode
And function independently from the browser
```

#### Feature 6: Display Charts Visualizing Event Details

**Scenario 1:** Chart shows events by city
```gherkin
Given the user is viewing the events page
When the user navigates to the charts section
Then a chart should display showing the number of events in each city
```

**Scenario 2:** Chart shows event categories
```gherkin
Given there are events with different categories
When the user views the visualization charts
Then a chart should show the distribution of events by category
```

**Scenario 3:** Charts are interactive
```gherkin
Given the user is viewing event charts
When the user clicks on a chart element
Then the chart should provide additional details or filter options
And the user should be able to drill down into specific data
```

## Technology Stack

- **Frontend:** React, Vite
- **Deployment:** Vercel
- **Version Control:** Git, GitHub
- **Testing:** Jest (for unit/integration testing)
- **PWA Features:** Service Workers, Web App Manifest
- **Data Visualization:** Recharts or similar charting library

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/souravdas090300/meet.git
cd meet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Deployment

The app is deployed on Vercel and can be accessed at: [Your Vercel URL]

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
