import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  let mockSetCurrentNOE;
  let mockSetErrorAlert;

  beforeEach(() => {
    mockSetCurrentNOE = jest.fn();
    mockSetErrorAlert = jest.fn();
  });

  test('renders text input', () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  test('default value of input field is 32', () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );
    expect(screen.getByRole('spinbutton')).toHaveValue(32);
  });

  test('updates number of events when user types', async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '10');

    expect(numberTextBox).toHaveValue(10);
    
    // Wait for debounced update
    await new Promise(resolve => setTimeout(resolve, 600));
    
    expect(mockSetCurrentNOE).toHaveBeenCalledWith(10);
    expect(mockSetErrorAlert).toHaveBeenCalledWith('');
  });

  test('calls setErrorAlert with error message when user enters negative number', async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '-5');

    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });

  test('calls setErrorAlert with error message when user enters zero', async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '0');

    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });

  test('input field prevents non-numeric characters', async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, 'abc');

    // Number input prevents non-numeric characters, so the value should remain empty
    expect(numberTextBox).toHaveValue(null);
    // No error should be triggered since the input is empty
    expect(mockSetErrorAlert).toHaveBeenCalledWith('');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });
});
