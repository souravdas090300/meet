import React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import EventList from '../components/EventList';
import App from '../App';
import mockData from '../mock-data';
import { getEvents, extractLocations } from '../api';

// Mock the api module
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn()
}));

// Mock the EventChart component to avoid recharts issues in tests
jest.mock('../components/EventChart', () => {
  return function EventChart() {
    return <div data-testid="event-chart">Event Chart</div>;
  };
});


describe('<EventList /> component', () => {
  // Add component-specific tests here if needed
});

describe('<EventList /> integration', () => {

});

test('renders a list of events when the app is mounted and rendered', async () => {
  // Setup mocks
  getEvents.mockResolvedValue(mockData);
  extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);
  
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  
  // Mock navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    value: true,
    writable: true,
  });

  const AppComponent = render(<App />);
  const AppDOM = AppComponent.container.firstChild;
  const EventListDOM = AppDOM.querySelector('#event-list');
  await waitFor(() => {
    const EventListItems = within(EventListDOM).queryAllByRole('listitem');
    expect(EventListItems.length).toBe(mockData.length); // Use actual mock data length
  });
});