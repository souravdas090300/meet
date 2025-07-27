import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';
import Event from '../components/Event';
import CitySearch from '../components/CitySearch';
import EventList from '../components/EventList';
import mockData from '../mock-data';

describe('<App /> component tests', () => {
  test('renders NumberOfEvents component', () => {
    const mockSetCurrentNOE = jest.fn();
    const mockSetErrorAlert = jest.fn();
    
    const { container } = render(
      <div className="App">
        <NumberOfEvents 
          currentNOE={32}
          setCurrentNOE={mockSetCurrentNOE}
          setErrorAlert={mockSetErrorAlert}
        />
      </div>
    );
    
    const numberComponent = container.querySelector('#number-of-events');
    expect(numberComponent).toBeInTheDocument();
  });

  test('loads events list correctly', () => {
    const mockEvents = mockData.slice(0, 3);
    
    render(<EventList events={mockEvents} />);
    
    const eventList = screen.getByRole('list');
    const events = within(eventList).getAllByRole('listitem');
    expect(events).toHaveLength(3);
  });

  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    const mockSetCurrentNOE = jest.fn();
    const mockSetErrorAlert = jest.fn();
    
    render(
      <NumberOfEvents 
        currentNOE={32}
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
      />
    );
    
    const numberInput = screen.getByTestId('numberOfEventsInput');
    await user.clear(numberInput);
    await user.type(numberInput, '10');

    expect(numberInput).toHaveValue('10');
    expect(mockSetCurrentNOE).toHaveBeenCalledWith('10');
  });

  test('renders event components correctly', () => {
    const mockEvent = mockData[0];
    
    render(<Event event={mockEvent} />);
    
    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });
});
