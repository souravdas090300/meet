// API functions for the Meet App
const EVENTS_API_URL = 'https://your-api-endpoint.com/api/events'; // Replace with your actual API endpoint

// Mock data for development/fallback
const mockEvents = [
  {
    id: 1,
    title: 'Sample Event 1',
    description: 'This is a sample event for testing purposes.',
    location: 'New York, NY',
    date: '2025-08-15',
    time: '18:00'
  },
  {
    id: 2,
    title: 'Sample Event 2',
    description: 'Another sample event for testing purposes.',
    location: 'Los Angeles, CA',
    date: '2025-08-20',
    time: '19:30'
  }
];

/**
 * Fetch events from API or return mock data
 */
export const getEvents = async () => {
  try {
    // For now, return mock data since we don't have the actual API endpoint
    // In production, replace this with actual API call
    return mockEvents;
    
    // Uncomment this when you have a real API:
    // const response = await fetch(EVENTS_API_URL);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    // return data.events || data;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data as fallback
    return mockEvents;
  }
};

/**
 * Extract unique locations from events
 */
export const extractLocations = (events) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  
  const locations = events.map(event => event.location);
  const uniqueLocations = [...new Set(locations)];
  return uniqueLocations.sort();
};

/**
 * Filter events by city
 */
export const filterEventsByCity = (events, city) => {
  if (!city || city === 'See all cities') {
    return events;
  }
  return events.filter(event => event.location === city);
};

/**
 * Limit the number of events returned
 */
export const limitEvents = (events, numberOfEvents) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  return events.slice(0, numberOfEvents);
};
