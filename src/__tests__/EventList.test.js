import React from 'react';
import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import EventList from '../components/EventList';
import App from '../App';
import mockData from '../mock-data';
import { extractLocations, getEvents } from '../api';

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
    
    const eventList = document.querySelector('#event-list');
    expect(eventList).toBeInTheDocument();
    
    const eventListItems = within(eventList).queryAllByRole('listitem');
    expect(eventListItems.length).toBe(0);
  });

  test('renders correct number of events', () => {
    const EventListComponent = render(<EventList events={
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    } />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(4);
  });
});

describe('<EventList /> integration', () => {
  test('renders a list of events when the app is mounted and rendered', () => {
    const mockEvents = mockData.slice(0, 3);
    
    render(<EventList events={mockEvents} />);
    
    const eventList = screen.getByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(3);
  });
});
