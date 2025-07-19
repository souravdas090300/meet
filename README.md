Meet App
A React-based progressive web application for event management and discovery. This app allows users to find and view events in their city, with offline functionality and data visualization features.

Project Overview
The Meet app is designed to help users discover events happening in their area. Built with React and using serverless functions, it provides a seamless experience for event discovery and management.

## Features

### User Stories

#### Feature 1: Filter Events by City ⭐
**User Story:**
```
As a user,
I should be able to filter events by city
So that I can see only events happening in cities that interest me and find relevant events in my area.
```

**Acceptance Criteria:**
- Users can search for events by city name
- Auto-suggestions appear when typing city names
- Events are filtered to show only those in the selected city
- Default view shows events from all cities when no filter is applied

Feature 2: Show/Hide Event Details
As a user,
I should be able to show and hide event details
So that I can get more information about events that interest me while keeping the interface clean and uncluttered.

Feature 3: Specify Number of Events
As a user,
I should be able to specify the number of events displayed
So that I can control how many events I see at once and customize my viewing experience.

Feature 4: Use the App When Offline
As a user,
I should be able to use the app when offline
So that I can access event information even when I don't have an internet connection.

Feature 5: Add an App Shortcut to the Home Screen
As a user,
I should be able to add an app shortcut to my device's home screen
So that I can quickly access the app without having to open a browser and navigate to the website.

Feature 6: Display Charts Visualizing Event Details
As a user,
I should be able to view charts that visualize event details
So that I can quickly understand event patterns and trends in my area.

## Scenarios (Gherkin Syntax)

### Feature 1: Filter Events by City 🎯

#### Scenario 1: When user hasn't searched for a city, show upcoming events from all cities
```gherkin
Given the user has opened the app
When the user hasn't searched for a city
Then upcoming events from all cities should be displayed
```

#### Scenario 2: User should see a list of suggestions when they search for a city
```gherkin
Given the user is on the main events page
When the user starts typing in the city search box
Then a list of city suggestions should be displayed
And the suggestions should match what the user has typed
```

#### Scenario 3: User can select a city from the suggested list
```gherkin
Given the user sees a list of city suggestions
When the user clicks on a city from the suggested list
Then the city should be selected
And events should be filtered to show only events from that city
```
Feature 2: Show/Hide Event Details
Scenario 1: Event details are hidden by default

Given the user has opened the app
When the user views the list of events
Then each event should display basic information only
And detailed information should be hidden
Scenario 2: User can expand event details

Given the user is viewing a list of events
When the user clicks on an event's "Show Details" button
Then the event should expand to show detailed information
And the button should change to "Hide Details"
Scenario 3: User can collapse event details

Given an event's details are currently expanded
When the user clicks on the "Hide Details" button
Then the event details should be hidden
And only basic event information should be visible
Feature 3: Specify Number of Events
Scenario 1: Default number of events is displayed

Given the user has not specified a number of events
When the user opens the app
Then 32 events should be displayed by default
Scenario 2: User can change the number of events displayed

Given the user is on the main events page
When the user enters a number in the "Number of Events" input field
Then the app should display that specified number of events
Scenario 3: User enters invalid number

Given the user is on the main events page
When the user enters an invalid number (negative, zero, or non-numeric)
Then the app should display an error message
And revert to the previous valid number or default
Feature 4: Use the App When Offline
Scenario 1: Show cached data when offline

Given the user has previously loaded events while online
When the user opens the app without an internet connection
Then the app should display the cached event data
And show an indicator that the user is offline
Scenario 2: Show error when no cached data available offline

Given the user has never used the app before
When the user opens the app without an internet connection
Then the app should display an error message
And inform the user that an internet connection is required for first use
Scenario 3: Sync data when connection is restored

Given the user was using the app offline
When the internet connection is restored
Then the app should automatically sync with the server
And update the event data with the latest information
Feature 5: Add an App Shortcut to the Home Screen
Scenario 1: User can install the app as PWA

Given the user is using a compatible browser
When the user visits the meet app
Then the browser should show an "Add to Home Screen" option
Scenario 2: App shortcut is added to home screen

Given the user has chosen to add the app to their home screen
When the installation process is complete
Then a shortcut icon should appear on the user's home screen
And clicking it should open the app directly
Scenario 3: App works independently from browser

Given the user has installed the app on their home screen
When the user opens the app from the home screen shortcut
Then the app should open in standalone mode
And function independently from the browser
Feature 6: Display Charts Visualizing Event Details
Scenario 1: Chart shows events by city

Given the user is viewing the events page
When the user navigates to the charts section
Then a chart should display showing the number of events in each city
Scenario 2: Chart shows event categories

Given there are events with different categories
When the user views the visualization charts
Then a chart should show the distribution of events by category
Scenario 3: Charts are interactive

Given the user is viewing event charts
When the user clicks on a chart element
Then the chart should provide additional details or filter options
And the user should be able to drill down into specific data
Technology Stack
Frontend: React, Vite
Backend: AWS Lambda (Serverless Functions)
API: Google Calendar API
Authentication: Google OAuth 2.0
Deployment: Vercel (Frontend), AWS Lambda (Backend)
Version Control: Git, GitHub
Testing: Jest (for unit/integration testing)
PWA Features: Service Workers, Web App Manifest
Data Visualization: Recharts or similar charting library
Serverless Architecture
This Meet app uses serverless architecture powered by AWS Lambda functions to handle authentication and API requests. The serverless approach offers several advantages:

How Serverless Functions Are Used
The Meet app implements serverless functions for:

OAuth Authentication: Lambda functions handle the Google OAuth 2.0 flow to authenticate users and obtain access tokens
API Gateway: Serverless functions act as a bridge between the React frontend and the Google Calendar API
Token Management: Secure handling of authentication tokens without maintaining a persistent server
Benefits of Serverless for Meet App
Cost Efficiency: Pay only when functions execute, no idle server costs
Automatic Scaling: Handles traffic spikes without manual intervention
Reduced Maintenance: No server infrastructure to manage or update
Fast Deployment: Quick deployment of individual functions
Security: Built-in security features and automatic updates
Architecture Overview
┌─────────────────┐    HTTPS     ┌──────────────────┐    HTTPS    ┌─────────────────────┐
│                 │ ──────────>  │                  │ ─────────>  │                     │
│  React Frontend │              │  AWS API Gateway │             │  Google Calendar    │
│   (Vercel)      │ <──────────  │   + Lambda       │ <─────────  │       API           │
│                 │              │   Functions      │             │                     │
└─────────────────┘              └──────────────────┘             └─────────────────────┘
                                          │
                                          │ OAuth 2.0
                                          ▼
                                 ┌──────────────────┐
                                 │                  │
                                 │ Google OAuth 2.0 │
                                 │ Authentication   │
                                 │    Server        │
                                 └──────────────────┘
Data Flow:

User requests events from React app
React app calls AWS API Gateway
Lambda function initiates OAuth flow with Google
User authenticates with Google OAuth
Google returns access token to Lambda
Lambda uses token to fetch events from Google Calendar API
Events are returned to React app for display
The application follows a serverless-first approach where the React frontend communicates with AWS Lambda functions that handle authentication and data retrieval from the Google Calendar API.

Project Structure
meet/
├── auth-server/              # AWS Lambda functions for authentication
│   ├── handler.js           # Lambda function handlers
│   ├── serverless.yml       # Serverless configuration
│   ├── package.json         # Auth server dependencies
│   └── .gitignore          # Auth server gitignore
├── src/                     # React application source code
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Application entry point
│   └── assets/             # Static assets
├── public/                  # Public assets
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
Getting Started
Prerequisites
Node.js (v14 or higher)
npm or yarn package manager
Installation
Clone the repository:
git clone https://github.com/souravdas090300/meet.git
cd meet
Install dependencies:
npm install
Start the development server:
npm run dev
Build for production:
npm run build
Deployment
Frontend Deployment
The frontend is deployed on Vercel and can be accessed at: [https://meet-pi-weld.vercel.app/]

Backend Deployment (Auth Server)
The serverless backend is deployed using AWS Lambda:

Configure AWS credentials:
aws configure
Deploy the auth server:
cd auth-server
serverless deploy
The deployment will provide API Gateway endpoints for:
GET /api/get-auth-url - Get Google OAuth URL
GET /api/token/{code} - Exchange code for access token
GET /api/get-events/{access_token} - Fetch calendar events
Development
npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build locally
npm run lint - Run ESLint
Serverless Architecture
The Meet app utilizes a serverless architecture to provide scalable, cost-effective event management functionality. Below is the system architecture diagram:

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│   React PWA     │◄──►│   Amazon API     │◄──►│   AWS Lambda    │
│   (Frontend)    │    │   Gateway        │    │   Functions     │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│   Service       │    │   CloudWatch     │    │   Google        │
│   Worker        │    │   Logs &         │    │   Calendar      │
│   (Cache)       │    │   Monitoring     │    │   API           │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
Architecture Components
React PWA Frontend: The client-side application built with React and Vite
Amazon API Gateway: RESTful API endpoints that trigger Lambda functions
AWS Lambda Functions:
getAuthURL: Generates Google OAuth authorization URLs
getAccessToken: Exchanges authorization codes for access tokens
getCalendarEvents: Fetches events from Google Calendar API
Google Calendar API: External API for accessing calendar data
CloudWatch: Monitoring and logging for Lambda functions
Service Worker: Handles offline functionality and caching
Benefits of Serverless Architecture
Automatic Scaling: Functions scale automatically based on demand
Cost Efficiency: Pay only for actual execution time
High Availability: Built-in redundancy and fault tolerance
Security: Secure OAuth flow without exposing credentials to client
Performance: Low latency through global edge locations
Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request
