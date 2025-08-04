import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    const mockSetCurrentNOE = jest.fn();
    const mockSetErrorAlert = jest.fn();
    
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    
    // Simulate changing the value directly
    fireEvent.change(numberTextBox, { target: { value: '10' } });

    // Check that the function was called
    expect(mockSetCurrentNOE).toHaveBeenCalledWith(10);
    expect(mockSetErrorAlert).toHaveBeenCalledWith('');
  });

  test('calls setErrorAlert with error message when user enters negative number', async () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    
    // Simulate entering a negative number
    fireEvent.change(numberTextBox, { target: { value: '-5' } });

    // Now check if the correct error message was called
    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });

  test('calls setErrorAlert with error message when user enters zero', async () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    
    // Simulate entering zero
    fireEvent.change(numberTextBox, { target: { value: '0' } });

    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only positive numbers are allowed');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });

  test('input field prevents non-numeric characters', async () => {
    render(
      <NumberOfEvents 
        setCurrentNOE={mockSetCurrentNOE}
        setErrorAlert={mockSetErrorAlert}
        currentNOE={32}
      />
    );

    const numberTextBox = screen.getByRole('spinbutton');
    
    // Try to enter non-numeric characters - the change event won't be triggered 
    // or will be handled by the browser for number inputs
    fireEvent.change(numberTextBox, { target: { value: 'abc' } });

    // Since non-numeric input should not trigger validation, error should be cleared
    expect(mockSetErrorAlert).toHaveBeenCalledWith('');
    expect(mockSetCurrentNOE).not.toHaveBeenCalled();
  });
});
