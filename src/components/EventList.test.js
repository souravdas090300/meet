import React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import EventList from './EventList';
import mockData from '../mock-data';

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
});

test('renders correct number of events', () => {
    const EventListComponent = render(<EventList events={
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    } />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(4);
  });