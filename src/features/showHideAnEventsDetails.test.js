import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  
  test('An event element is collapsed by default', ({ given, when, then, and }) => {
    let AppComponent;

    given('user hasn\'t searched for any city', () => {
      // Setup code (if needed)
    });

    when('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    then('the user should see a list of events', async () => {
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });

    and('all event details should be hidden', async () => {
      const AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        EventListItems.forEach(event => {
          const eventDetails = event.querySelector('.event-details');
          expect(eventDetails).toBeNull();
        });
      });
    });
  });

  test('User can expand an event to see its details', ({ given, when, then }) => {
    let AppComponent;

    given('the main page is open', () => {
      AppComponent = render(<App />);
    });

    when('the user clicks on "Show details" button for an event', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });

      const EventListDOM = AppDOM.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const firstEvent = EventListItems[0];
      const detailsButton = firstEvent.querySelector('.details-btn');
      await user.click(detailsButton);
    });

    then('the event details should be displayed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      
      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        const firstEvent = EventListItems[0];
        const eventDetails = firstEvent.querySelector('.event-details');
        expect(eventDetails).toBeDefined();
        expect(eventDetails).not.toBeNull();
      });
    });
  });

  test('User can collapse an event to hide its details', ({ given, when, then }) => {
    let AppComponent;

    given('the user has expanded an event\'s details', async () => {
      const user = userEvent.setup();
      AppComponent = render(<App />);
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });

      const EventListDOM = AppDOM.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const firstEvent = EventListItems[0];
      const detailsButton = firstEvent.querySelector('.details-btn');
      await user.click(detailsButton);

      // Verify details are shown
      await waitFor(() => {
        const eventDetails = firstEvent.querySelector('.event-details');
        expect(eventDetails).not.toBeNull();
      });
    });

    when('the user clicks on "Hide details" button', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const firstEvent = EventListItems[0];
      const detailsButton = firstEvent.querySelector('.details-btn');
      await user.click(detailsButton);
    });

    then('the event details should be hidden', async () => {
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        const firstEvent = EventListItems[0];
        const eventDetails = firstEvent.querySelector('.event-details');
        expect(eventDetails).toBeNull();
      });
    });
  });
});
