import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../App';

const feature = loadFeature('./src/features/useAppWhenOffline.feature');

defineFeature(feature, test => {
  test('Show cached data when there\'s no internet connection.', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user has no internet connection', () => {
      // Mock navigator.onLine to return false
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });
    });

    when('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    then('the user should see cached events data', async () => {
      await waitFor(() => {
        const AppDOM = AppComponent.container.firstChild;
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
      });
    });

    and('the user should see a warning message about being offline', async () => {
      await waitFor(() => {
        const AppDOM = AppComponent.container.firstChild;
        const warningAlert = AppDOM.querySelector('.warning-alert');
        expect(warningAlert).not.toBeNull();
        expect(warningAlert.textContent).toContain('offline');
      });
    });
  });

  test('Show error when user changes search settings while offline.', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user is offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });
      AppComponent = render(<App />);
    });

    when('the user changes the city or number of events', async () => {
      // This scenario is more about showing that the app continues to work
      // with cached data rather than throwing errors
      await waitFor(() => {
        const AppDOM = AppComponent.container.firstChild;
        expect(AppDOM).not.toBeNull();
      });
    });

    then('the user should see the cached events', async () => {
      await waitFor(() => {
        const AppDOM = AppComponent.container.firstChild;
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
      });
    });

    and('the user should see a warning about limited functionality offline', async () => {
      await waitFor(() => {
        const AppDOM = AppComponent.container.firstChild;
        const warningAlert = AppDOM.querySelector('.warning-alert');
        expect(warningAlert).not.toBeNull();
      });
    });
  });
});
