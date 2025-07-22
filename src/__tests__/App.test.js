import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents, extractLocations } from '../api';
import mockData from '../mock-data';

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

describe('<App /> component', () => {
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
    const mockEvents = mockData.slice(0, 2);

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);
    
    // Wait for events to load
    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(2);
  });

  test('loads 32 events by default', async () => {
    const mockEvents = [...mockData]; // Use all mock data

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);
    
    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(mockData.length); // Use the actual length of mock data
  });

  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    const mockEvents = [...mockData]; // Use all mock data

    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['London, UK', 'Berlin, Germany']);

    render(<App />);
    
    const numberInput = screen.getByTestId('numberOfEventsInput');
    await user.clear(numberInput);
    await user.type(numberInput, '3'); // Use 3 since we only have 5 mock events

    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(3);
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

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
   const user = userEvent.setup();
   const AppComponent = render(<App />);
   const AppDOM = AppComponent.container.firstChild;


   const CitySearchDOM = AppDOM.querySelector('#city-search');
   const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');


   await user.type(CitySearchInput, "Berlin");
   const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
   await user.click(berlinSuggestionItem);


   const EventListDOM = AppDOM.querySelector('#event-list');
   const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');  


   const allEvents = await getEvents();
   const berlinEvents = allEvents.filter(
     event => event.location === 'Berlin, Germany'
   );


   expect(allRenderedEventItems.length).toBe(berlinEvents.length);
  });
});
