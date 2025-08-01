import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import NumberOfEvents from '../components/NumberOfEvents';
import Event from '../components/Event';
import CitySearch from '../components/CitySearch';
import EventList from '../components/EventList';
import mockData from '../mock-data';
import { getEvents, extractLocations } from '../api';

// Mock the API functions
jest.mock('../api');

describe('<App /> integration tests', () => {
  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    
    // Create mock events array with enough events to test filtering
    const mockEvents = [...Array(50)].map((_, index) => ({
      id: `event-${index}`,
      summary: `Event ${index + 1}`,
      location: 'Test Location',
      created: new Date().toISOString(),
      start: { dateTime: new Date().toISOString() }
    }));

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);

    // Wait for the app to load with default 32 events
    const eventList = await screen.findByRole('list');
    let events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(32); // Default number

    // Find the number of events input field
    const numberInput = screen.getByTestId('numberOfEventsInput');
    expect(numberInput).toHaveValue(32); // Default value (number)

    // Change the number of events to 10 using backspace method as suggested
    await user.type(numberInput, '{backspace}{backspace}10');

    // Wait for the event list to update
    await waitFor(() => {
      const updatedEvents = within(eventList).getAllByRole('listitem');
      expect(updatedEvents).toHaveLength(10);
    });
  });
});

describe('<App /> component tests', () => {
  test('loads 32 events by default when mockEvents is 32 or bigger', async () => {
    // Create mock events array with 35 events (more than 32)
    const mockEvents = [...Array(35)].map((_, index) => ({
      id: `event-${index}`,
      summary: `Event ${index + 1}`,
      location: 'Test Location',
      created: new Date().toISOString(),
      start: { dateTime: new Date().toISOString() }
    }));

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);

    // Wait for the event list to load
    const eventList = await screen.findByRole('list');
    await waitFor(() => {
      const events = within(eventList).getAllByRole('listitem');
      // If there are 32 or more events, should render exactly 32 by default
      expect(events).toHaveLength(32);
    });
  });

  test('renders all events when mockEvents is less than 32', async () => {
    // Use the actual mockData which has only 5 events (less than 32)
    const mockEvents = [...mockData];

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);

    // Wait for the event list to load
    const eventList = await screen.findByRole('list');
    await waitFor(() => {
      const events = within(eventList).getAllByRole('listitem');
      // If there are fewer than 32 events, render all available events
      expect(events).toHaveLength(mockEvents.length); // Should be 5
    });
  });

  test('renders NumberOfEvents component', () => {
    const mockSetCurrentNOE = jest.fn();
    const mockSetErrorAlert = jest.fn();
    
    const { container } = render(
      <div className="App">
        <NumberOfEvents 
          currentNOE={32}
          setCurrentNOE={mockSetCurrentNOE}
          setErrorAlert={mockSetErrorAlert}
        />
      </div>
    );
    
    const numberComponent = container.querySelector('#number-of-events');
    expect(numberComponent).toBeInTheDocument();
  });

  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    const mockSetCurrentNOE = jest.fn();
    const mockSetErrorAlert = jest.fn();
    
    render(
      <NumberOfEvents 
        currentNOE={32}
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
      />
    );
    
    const numberInput = screen.getByTestId('numberOfEventsInput');
    await user.clear(numberInput);
    await user.type(numberInput, '10');

    expect(numberInput).toHaveValue(10);
    
    // Wait for debounced call (NumberOfEvents has 500ms debounce)
    await waitFor(() => {
      expect(mockSetCurrentNOE).toHaveBeenCalledWith(10);
    }, { timeout: 1000 });
  });

  test('renders event components correctly', () => {
    const mockEvent = mockData[0];
    
    render(<Event event={mockEvent} />);
    
    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });
});
