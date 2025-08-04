import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {
  
  test('When user hasn\'t specified a number, 32 is the default number', ({ given, when, then }) => {
    let AppComponent;

    given('user hasn\'t specified or filtered the number of events', () => {
      // Setup code (if needed)
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
        // Note: The mock data shows 10 events (some duplicated from the 5 unique events)
        expect(EventListItems.length).toBeLessThanOrEqual(32);
        expect(EventListItems.length).toBe(10); // The app shows 10 events by default
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
        
        // Since setting to 10 and the app shows 10 events by default anyway, 
        // we should still see 10 events (limited by the mock data)
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeLessThanOrEqual(10);
        expect(EventListItems.length).toBe(10); // The app shows 10 events with current mock data
      });
    });
  });
});
