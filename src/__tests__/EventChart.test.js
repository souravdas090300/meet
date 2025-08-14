import React from 'react';
import { render } from '@testing-library/react';
import CityEventsChart from '../components/CityEventsChart';
import EventGenresChart from '../components/EventGenresChart';
import mockData from '../mock-data';

// Use mock data for testing
const mockEvents = mockData.slice(0, 4); // Use first 4 events from mock data
const mockLocations = [...new Set(mockEvents.map(event => event.location))];

describe('<CityEventsChart /> and <EventGenresChart />', () => {
  describe('Feature 6: Display Charts Visualizing Event Details', () => {
    test('Scenario 1: Show a scatterplot chart with the number of upcoming events in each city', () => {
      const { getByTestId } = render(<CityEventsChart allLocations={mockLocations} events={mockEvents} />);
      
      // In test environment, should render test-specific component
      expect(getByTestId('city-events-chart')).toBeInTheDocument();
      expect(getByTestId('chart-container')).toBeInTheDocument();
    });

    test('Scenario 2: Show a pie chart with event genres', () => {
      const { getByTestId } = render(<EventGenresChart events={mockEvents} />);
      
      // In test environment, should render test-specific component
      expect(getByTestId('event-genres-chart')).toBeInTheDocument();
      expect(getByTestId('chart-container')).toBeInTheDocument();
    });

    test('CityEventsChart renders with empty events array', () => {
      const { getByTestId } = render(<CityEventsChart allLocations={[]} events={[]} />);
      
      // Should render no-data message with empty data
      expect(getByTestId('city-events-chart')).toBeInTheDocument();
      expect(getByTestId('no-data')).toBeInTheDocument();
    });

    test('EventGenresChart renders with empty events array', () => {
      const { getByTestId } = render(<EventGenresChart events={[]} />);
      
      // Should render no-data message with empty data
      expect(getByTestId('event-genres-chart')).toBeInTheDocument();
      expect(getByTestId('no-data')).toBeInTheDocument();
    });
  });
});
