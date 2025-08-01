import React from 'react';
import { render, screen } from '@testing-library/react';
import EventChart from '../components/EventChart';
import mockData from '../mock-data';

// Use mock data for testing
const mockEvents = mockData.slice(0, 4); // Use first 4 events from mock data

describe('<EventChart />', () => {
  describe('Feature 6: Display Charts Visualizing Event Details', () => {
    test('Scenario 1: Show a chart with the number of upcoming events in each city', () => {
      render(<EventChart events={mockEvents} />);
      
      // Check if the main chart title is rendered
      expect(screen.getByText('Event Statistics')).toBeInTheDocument();
      
      // Check if the location chart section is rendered
      expect(screen.getByText('Events by Location')).toBeInTheDocument();
      
      // Check if event count section is rendered
      expect(screen.getByText('Event Count by Location')).toBeInTheDocument();
    });

    test('renders simple event statistics', () => {
      render(<EventChart events={mockEvents} />);
      
      // Check if the statistics are displayed
      expect(screen.getByText('Event Statistics')).toBeInTheDocument();
      expect(screen.getByText(/Total events:/)).toBeInTheDocument();
    });

    test('shows no events message when empty', () => {
      render(<EventChart events={[]} />);
      
      // Check if no events message is shown
      expect(screen.getByText('No events to display')).toBeInTheDocument();
    });
  });
});
