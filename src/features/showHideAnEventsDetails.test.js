import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the API
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getEvents: jest.fn(),
  isLoggedIn: jest.fn(() => false),
  extractLocations: jest.fn()
}));

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  
  // Set up mock data before all tests
  beforeEach(() => {
    const mockEvents = [
      { id: 1, summary: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, summary: 'Event 2', location: 'London, UK' },
      { id: 3, summary: 'Event 3', location: 'Berlin, Germany' },
      { id: 4, summary: 'Event 4', location: 'New York, NY, USA' },
      { id: 5, summary: 'Event 5', location: 'London, UK' }
    ];
    
    const { getEvents, extractLocations } = require('../api');
    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(['Berlin, Germany', 'London, UK', 'New York, NY, USA']);
  });
  
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
      });
      
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems).toHaveLength(5);
      });
    });

    and('all event details should be hidden', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      
      await waitFor(() => {
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
      });
      
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });

      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const firstEvent = EventListItems[0];
      const detailsButton = firstEvent.querySelector('.details-btn');
      await user.click(detailsButton);
    });

    then('the event details should be displayed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      
      await waitFor(() => {
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
      });
      
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });

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
      const EventListDOM = AppDOM.querySelector('#event-list');
      
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        const firstEvent = EventListItems[0];
        const eventDetails = firstEvent.querySelector('.event-details');
        expect(eventDetails).toBeNull();
      });
    });
  });
});
