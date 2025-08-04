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
      render(<CityEventsChart allLocations={mockLocations} events={mockEvents} />);
      
      // The scatterplot should render without errors
      // We can't easily test Recharts content without additional setup
      expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    test('Scenario 2: Show a pie chart with event genres', () => {
      render(<EventGenresChart events={mockEvents} />);
      
      // The pie chart should render without errors
      expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    test('CityEventsChart renders with empty events array', () => {
      render(<CityEventsChart allLocations={[]} events={[]} />);
      
      // Should render the chart container even with empty data
      expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    test('EventGenresChart renders with empty events array', () => {
      render(<EventGenresChart events={[]} />);
      
      // Should render the chart container even with empty data
      expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });
  });
});
