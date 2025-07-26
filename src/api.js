import mockData from './mock-data';

/**
 * This function takes an events array, then uses map to create a new array with only locations.
 * It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.
 * The Set will remove all duplicates from the array.
 */
export const extractLocations = (events) => {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  
  const extractedLocations = events
    .filter(event => event && event.location) // Filter out events without location
    .map((event) => event.location)
    .filter(location => location && typeof location === 'string'); // Filter out invalid locations
    
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 * This function will fetch the list of all events
 * Note: Serverless functionality has been removed, now uses mock data only
 */
export const getEvents = async () => {
  console.log('Using mock data - serverless functionality removed');
  return mockData;
};

/**
 * Mock function for getAccessToken - serverless functionality removed
 */
export const getAccessToken = async () => {
  console.log('Mock getAccessToken - serverless functionality removed');
  return null;
};
