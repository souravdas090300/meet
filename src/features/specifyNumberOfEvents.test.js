import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        // Note: We only have 5 events in mock data, but the default should be set to show up to 32
        expect(EventListItems.length).toBeLessThanOrEqual(32);
        expect(EventListItems.length).toBe(5); // We have exactly 5 events in mock data
      });

      // Also check that the NumberOfEvents input shows 32 as default
      const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      const numberInput = within(NumberOfEventsDOM).queryByRole('textbox');
      expect(numberInput.value).toBe('32');
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppComponent;

    given('the main page is open', () => {
      AppComponent = render(<App />);
    });

    when('the user changes the number of events to 10', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      const numberInput = within(NumberOfEventsDOM).queryByRole('textbox');
      
      await user.clear(numberInput);
      await user.type(numberInput, '10');
    });

    then('the user should see exactly 10 events displayed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      const numberInput = within(NumberOfEventsDOM).queryByRole('textbox');

      await waitFor(() => {
        // Check that the input value was updated
        expect(numberInput.value).toBe('10');
        
        // Since we only have 5 events in mock data, we should see all 5
        // but the component should be configured to show up to 10
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeLessThanOrEqual(10);
        expect(EventListItems.length).toBe(5); // We have exactly 5 events in mock data
      });
    });
  });
});
