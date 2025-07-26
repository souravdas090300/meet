# Meet App

A **React-based Progressive Web Application (PWA)** for event management and discovery. Meet helps users find and view upcoming events in their city with offline support and rich data visualizations.

---

## 📌 Project Overview

Meet is designed to help users discover local events. Built using **React** and **mock data**, the app provides a fast, reliable, and interactive experience with PWA capabilities.

---

## ✨ Features

- Filter events by city  
- Show/hide event details  
- Specify number of displayed events  
- Offline functionality via service worker  
- Add shortcut to home screen  
- Interactive charts for event data visualization  

---

## 👤 User Stories

### Feature 1: Filter Events by City ⭐  
**User Story**  
As a user, I should be able to filter events by city so that I can see relevant events in my area.  

**Acceptance Criteria**  
- Users can search for events by city name  
- Auto-suggestions appear while typing  
- Events are filtered by selected city  
- All cities’ events are shown when no filter is applied  

---

### Feature 2: Show/Hide Event Details  
As a user, I should be able to toggle event details so that I can focus only on what interests me.  

---

### Feature 3: Specify Number of Events  
As a user, I should be able to control how many events I see at once.  

---

### Feature 4: Use the App Offline  
As a user, I should be able to access event data even without an internet connection.  

---

### Feature 5: Add App Shortcut to Home Screen  
As a user, I want to install the app for quick access from my home screen.  

---

### Feature 6: Display Charts for Event Insights  
As a user, I want visualizations to understand trends and categories of events.  

---

## ✅ Scenarios (Gherkin Syntax)

### Feature 1: Filter Events by City 🎯

```gherkin
Scenario: Show events from all cities when no search
Given the user opens the app
When the user hasn’t searched for a city
Then show events from all cities

Scenario: Auto-suggestions when typing city
Given the user types in the city search box
Then a list of matching suggestions should be shown

Scenario: Selecting city filters events
Given the user selects a city from suggestions
Then show only events from that city
```

---

### Feature 2: Show/Hide Event Details

```gherkin
Scenario: Event details hidden by default
Given user opens the app
Then each event shows only basic info

Scenario: Expand event details
When user clicks "Show Details"
Then show detailed event info

Scenario: Collapse event details
When user clicks "Hide Details"
Then hide the extra info
```

---

### Feature 3: Specify Number of Events

```gherkin
Scenario: Show 32 events by default
When user opens the app
Then 32 events are shown

Scenario: User inputs a number
When a valid number is entered
Then show that many events

Scenario: Invalid number entered
Then show an error and revert to previous value
```

---

### Feature 4: Offline Usage

```gherkin
Scenario: Show cached events when offline
Given user used app before
Then show previously loaded events offline

Scenario: First time use with no connection
Then show error and prompt for internet

Scenario: Sync when back online
When connection is restored
Then fetch latest events automatically
```

---

### Feature 5: Install as PWA

```gherkin
Scenario: "Add to Home Screen" option appears
When user visits on a compatible browser
Then browser shows install prompt

Scenario: App added to home screen
Then app opens in standalone mode
```

---

### Feature 6: Charts Visualization

```gherkin
Scenario: Show chart of events per city
Then user sees visual representation by city

Scenario: Show chart by categories
Then chart shows event distribution by type

Scenario: Interactivity
Then clicking chart elements gives detailed insights
```

---

## 🧰 Technology Stack

| Area           | Tech                            |
|----------------|----------------------------------|
| Frontend       | React, Vite                     |
| Data Source    | Mock Data                       |
| Deployment     | Vercel                          |
| Version Control| Git, GitHub                     |
| Testing        | Jest                            |
| PWA Features   | Service Worker, Web App Manifest|
| Charts         | Recharts                        |

---

## 📊 System Architecture

```
React Frontend (Vercel)
       │
       ▼
Mock Data (Local)
```

---

## 🗂 Project Structure

```
meet/
│   └── package.json
├── src/                    # React app source
│   ├── App.jsx
│   ├── main.jsx
│   └── assets/
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn

### Installation

```bash
git clone https://github.com/souravdas090300/meet.git
cd meet
npm install
```

The app is ready to use with mock data - no additional configuration needed.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 📦 Deployment

### Frontend (Vercel)

> Live: [https://meet-pi-weld.vercel.app/](https://meet-pi-weld.vercel.app/)

The app uses mock data and doesn't require backend deployment.

---

## 🧪 Development Scripts

| Command         | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start local dev server               |
| `npm run build`  | Build for production                 |
| `npm run preview`| Preview production build             |
| `npm run lint`   | Run ESLint for code quality checks   |

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new feature branch  
3. Commit and push your changes  
4. Open a pull request 🚀  

---

## 📄 License

MIT © [Sourav Das]

