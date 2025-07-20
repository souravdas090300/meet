import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';

const mockProps = {
  allLocations: ['Berlin, Germany', 'London, UK', 'New York, NY, USA'],
  setCurrentCity: jest.fn(),
  setInfoAlert: jest.fn()
};

describe('<CitySearch /> component', () => {
  beforeEach(() => {
    render(<CitySearch {...mockProps} />);
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
