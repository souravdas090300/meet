import React from 'react';
import { render, within, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import mockData from '../mock-data';
import { extractLocations, getEvents } from '../api';

// Mock the API functions
jest.mock('../api');

describe('<CitySearch /> component', () => {
 // Same Code
});


describe('<CitySearch /> integration', () => {


});


const mockProps = {
  allLocations: ['Berlin, Germany', 'London, UK', 'New York, NY, USA'],
  setCurrentCity: jest.fn(),
  setInfoAlert: jest.fn()
};

describe('<CitySearch /> component', () => {
 let CitySearchComponent;
 beforeEach(() => {
  CitySearchComponent = render(<CitySearch {...mockProps} />);
 });

  test('renders text input', () => {
    const cityTextBox = screen.getByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus', async () => {
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.click(cityTextBox);
    const suggestionList = screen.getByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, 'Berlin');

    // filter allLocations to locations matching "Berlin"
    const suggestions = mockProps.allLocations.filter((location) => {
      return location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1;
    });

    // get all <li> elements inside the suggestion list
    const suggestionListItems = screen.getAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    for (let i = 0; i < suggestions.length; i += 1) {
      expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole('textbox');
    await user.type(cityTextBox, 'Berlin');

    // the suggestion's textContent look like this: "Berlin, Germany"
    const BerlinGermanySuggestion = screen.getByText('Berlin, Germany');
    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> integration', () => {
  test('renders suggestions list when the app is rendered.', async () => {
    // Mock the API functions for the App component
    getEvents.mockResolvedValue(mockData);
    // We have 4 unique locations in the mock data: London, Berlin, Paris, New York
    const mockLocations = ['London, UK', 'Berlin, Germany', 'Paris, France', 'New York, NY, USA'];
    extractLocations.mockReturnValue(mockLocations);

    const user = userEvent.setup();
    
    render(<App />);
    
    // Wait for the app to load and find the city search input
    const cityTextBox = await screen.findByTestId('city-search-input');
    
    // Click on the textbox to trigger suggestions
    await user.click(cityTextBox);
    
    // Wait for suggestions to appear
    await waitFor(() => {
      // Look specifically for suggestions within the city search component
      const citySearchComponent = screen.getByTestId('city-search-input').closest('.city-search');  
      const suggestions = within(citySearchComponent).queryAllByRole('listitem');
      // Expect to have locations + "See all cities" option
      expect(suggestions.length).toBe(mockLocations.length + 1);
    });
  });
});