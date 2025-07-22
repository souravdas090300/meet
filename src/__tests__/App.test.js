import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
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

describe('<App /> integration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    getEvents.mockClear();
    extractLocations.mockClear();
    
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
  });

  test('renders list of events', async () => {
    const mockEvents = [
      {
        id: '1',
        summary: 'Learn JavaScript',
        location: 'London, UK',
        created: '2020-05-19T19:17:46.000Z',
        description: 'JavaScript workshop'
      },
      {
        id: '2', 
        summary: 'React is Fun',
        location: 'Berlin, Germany',
        created: '2020-05-20T19:17:46.000Z',
        description: 'React workshop'
      }
    ];

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);
    
    // Wait for events to load
    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(2);
  });

  test('loads 32 events by default', async () => {
    const mockEvents = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      summary: `Event ${i + 1}`,
      location: 'Test Location',
      created: '2020-05-19T19:17:46.000Z',
      description: 'Test event'
    }));

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['Test Location']);

    render(<App />);
    
    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(32);
  });

  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    const mockEvents = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      summary: `Event ${i + 1}`,
      location: 'Test Location',
      created: '2020-05-19T19:17:46.000Z',
      description: 'Test event'
    }));

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['Test Location']);

    render(<App />);
    
    const numberInput = screen.getByTestId('numberOfEventsInput');
    await user.clear(numberInput);
    await user.type(numberInput, '10');

    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(10);
  });

  test('renders NumberOfEvents component', async () => {
    const mockEvents = [];
    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue([]);

    const { container } = render(<App />);
    const numberComponent = container.firstChild.querySelector('#number-of-events');
    expect(numberComponent).toBeInTheDocument();
  });
});
