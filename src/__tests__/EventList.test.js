import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import CitySearch from '../components/CitySearch';
import EventList from '../components/EventList';
import App from '../App';
import mockData from '../mock-data';
import { extractLocations, getEvents } from '../api';

// Mock the API functions
jest.mock('../api');

describe('<EventList /> component', () => {
  test('renders list of events', () => {
    const mockEvents = mockData.slice(0, 2);
    render(<EventList events={mockEvents} />);
    
    const eventList = document.querySelector('#event-list');
    expect(eventList).toBeInTheDocument();
    
    const eventListItems = within(eventList).queryAllByRole('listitem');
    expect(eventListItems.length).toBe(2);
  });

  test('renders empty list when no events provided', () => {
    render(<EventList events={[]} />);

    const eventList = document.querySelector('.event-list');
    expect(eventList).toBeInTheDocument();

    // When no events, there should be no list items
    expect(eventList.textContent).toContain('No events found');
  });

  test('renders correct number of events', () => {
    const EventListComponent = render(<EventList events={
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    } />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(4);
  });
});

describe('<EventList /> integration', () => {
  test('renders a list of events when the app is mounted and rendered', async () => {
    // Mock the API functions for the App component
    getEvents.mockResolvedValue(mockData);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);

    // Wait for the EventList to be rendered within the App
    // Look specifically for the event list by its ID
    await waitFor(() => {
      const eventList = document.querySelector('#event-list');
      expect(eventList).toBeInTheDocument();

      // Verify that events are rendered within the EventList
      const events = within(eventList).getAllByRole('listitem');
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
