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
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('default value of input field is 32', () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('32');
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

    const numberTextBox = screen.getByRole('textbox');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '10');

    expect(numberTextBox).toHaveValue('10');
    expect(mockSetCurrentNOE).toHaveBeenCalledWith('10');
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

    const numberTextBox = screen.getByRole('textbox');
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

    const numberTextBox = screen.getByRole('textbox');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '0');

    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });

  test('calls setErrorAlert with error message when user enters non-numeric characters', async () => {
    const user = userEvent.setup();
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('textbox');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, 'abc');

    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });
});
