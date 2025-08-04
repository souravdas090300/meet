import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import { getEvents } from '../api';

// Mock the API module
jest.mock('../api');

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {
  
  test('When user hasn\'t specified a number, 32 is the default number', ({ given, when, then }) => {
    let AppComponent;

    given('user hasn\'t specified or filtered the number of events', () => {
      // Mock getEvents to return mock data
      getEvents.mockResolvedValue([
        { id: '1', summary: 'Event 1', location: 'Location 1' },
        { id: '2', summary: 'Event 2', location: 'Location 2' },
        { id: '3', summary: 'Event 3', location: 'Location 3' },
        { id: '4', summary: 'Event 4', location: 'Location 4' },
        { id: '5', summary: 'Event 5', location: 'Location 5' },
        { id: '6', summary: 'Event 6', location: 'Location 6' },
        { id: '7', summary: 'Event 7', location: 'Location 7' },
        { id: '8', summary: 'Event 8', location: 'Location 8' },
        { id: '9', summary: 'Event 9', location: 'Location 9' },
        { id: '10', summary: 'Event 10', location: 'Location 10' }
      ]);
    });

    when('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    then('the user should see 32 events by default', async () => {
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        // Should show 10 events (our mock data length) which is less than 32
        expect(EventListItems.length).toBeLessThanOrEqual(32);
        expect(EventListItems.length).toBe(10); // The mock data has 10 events
      });

      // Also check that the NumberOfEvents input shows 32 as default
      const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      expect(NumberOfEventsDOM).not.toBeNull();
      const numberInput = within(NumberOfEventsDOM).queryByRole('spinbutton'); // Number inputs have spinbutton role
      expect(numberInput.value).toBe('32');
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppComponent;

    given('the main page is open', () => {
      // Mock getEvents to return mock data
      getEvents.mockResolvedValue([
        { id: '1', summary: 'Event 1', location: 'Location 1' },
        { id: '2', summary: 'Event 2', location: 'Location 2' },
        { id: '3', summary: 'Event 3', location: 'Location 3' },
        { id: '4', summary: 'Event 4', location: 'Location 4' },
        { id: '5', summary: 'Event 5', location: 'Location 5' },
        { id: '6', summary: 'Event 6', location: 'Location 6' },
        { id: '7', summary: 'Event 7', location: 'Location 7' },
        { id: '8', summary: 'Event 8', location: 'Location 8' },
        { id: '9', summary: 'Event 9', location: 'Location 9' },
        { id: '10', summary: 'Event 10', location: 'Location 10' }
      ]);
      AppComponent = render(<App />);
    });

    when('the user changes the number of events to 10', async () => {
      const AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
        expect(NumberOfEventsDOM).not.toBeNull();
        const numberInput = within(NumberOfEventsDOM).queryByRole('spinbutton'); // Number inputs have spinbutton role
        
        // Use fireEvent instead of userEvent for number inputs (controlled components)
        fireEvent.change(numberInput, { target: { value: '10' } });
      });
    });

    then('the user should see exactly 10 events displayed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
        expect(EventListDOM).not.toBeNull();
        expect(NumberOfEventsDOM).not.toBeNull();
        
        const numberInput = within(NumberOfEventsDOM).queryByRole('spinbutton'); // Number inputs have spinbutton role

        // Check that the input value was updated
        expect(numberInput.value).toBe('10');
        
        // Should show 10 events from our mock data
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeLessThanOrEqual(10);
        expect(EventListItems.length).toBe(10); // The app shows 10 events with mock data
      });
    });
  });
});
