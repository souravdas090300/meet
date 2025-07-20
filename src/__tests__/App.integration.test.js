import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

// Mock the api module
jest.mock('../api');

describe('<App /> integration', () => {
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

    render(<App />);
    
    const numberInput = screen.getByTestId('numberOfEventsInput');
    await user.clear(numberInput);
    await user.type(numberInput, '10');

    const eventList = await screen.findByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(10);
  });
});
