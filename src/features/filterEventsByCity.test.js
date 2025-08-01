import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

console.log('Loading feature file...');
const feature = loadFeature('./src/features/filterEventsByCity.feature');
console.log('Feature loaded:', feature);

defineFeature(feature, (test) => {
  console.log('Defining feature tests...');
  
  test('When user has not searched for a city, show upcoming events from all cities.', ({ given, when, then }) => {
    let AppComponent;

    given('user has not searched for any city', () => {
      // Setup code (if needed)
    });

    when('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    then('the user should see the list of all upcoming events.', async () => {
      const AppDOM = AppComponent.container.firstChild;

      await waitFor(() => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });
  });

  test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
    let AppComponent;

    given('the main page is open', () => {
      AppComponent = render(<App />);
    });

    when('user starts typing in the city textbox', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const CitySearchDOM = AppDOM.querySelector('.city-search');
      expect(CitySearchDOM).not.toBeNull();
      
      const citySearchInput = within(CitySearchDOM).queryByRole('textbox');
      await user.type(citySearchInput, "Berlin");
    });

    then('the user should receive a list of cities (suggestions) that match what they\'ve typed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const CitySearchDOM = AppDOM.querySelector('.city-search');

      await waitFor(() => {
        const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
        expect(suggestionListItems.length).toBeGreaterThan(0);
      });
    });
  });

  test('User can select a city from the suggested list.', ({ given, and, when, then }) => {
    let AppComponent;
    let AppDOM; 
    let CitySearchDOM;
    let citySearchInput;
    let suggestionListItems;

    given('user was typing "Berlin" in the city textbox', async () => {
      AppComponent = render(<App />);
      const user = userEvent.setup();
      AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('.city-search');
      expect(CitySearchDOM).not.toBeNull();
      
      citySearchInput = within(CitySearchDOM).queryByRole('textbox');  
      await user.type(citySearchInput, "Berlin");
    });

    and('the list of suggested cities is showing', async () => {
      await waitFor(() => {
        suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem'); 
        expect(suggestionListItems.length).toBeGreaterThan(0);
      });
    });
    
    when('the user selects a city (e.g., "Berlin, Germany") from the list', async () => {
      const user = userEvent.setup();
      await user.click(suggestionListItems[0]);
    });

    then('their city should be changed to that city (i.e., "Berlin, Germany")', () => {
      expect(citySearchInput.value).toBe('Berlin, Germany');
    });

    and('the user should receive a list of upcoming events in that city', async () => {
      await waitFor(async () => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        expect(EventListDOM).not.toBeNull();
        
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');

        // Check that events are displayed after city selection
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });
  });
});
