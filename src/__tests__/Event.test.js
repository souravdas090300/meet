import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import mockData from '../mock-data';

const mockEvent = mockData[0]; // Use the first event from mock data

describe('<Event /> component', () => {
  test('renders event element', () => {
    render(<Event event={mockEvent} />);
    expect(screen.getByText('Learn JavaScript')).toBeInTheDocument();
  });

  test('renders event title', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(mockEvent.summary)).toBeInTheDocument();
  });

  test('renders event start time', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(mockEvent.created)).toBeInTheDocument();
  });

  test('renders event location', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(mockEvent.location)).toBeInTheDocument();
  });

  test('renders event show details button', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText('Show Details')).toBeInTheDocument();
  });

  test('by default, event details are hidden', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText('About event:')).not.toBeInTheDocument();
  });

  test('shows details section when user clicks on "Show Details" button', async () => {
    const user = userEvent.setup();
    render(<Event event={mockEvent} />);
    
    const button = screen.getByRole('button', { name: /show details/i });
    await user.click(button);
    
    expect(screen.getByText('About event:')).toBeInTheDocument();
  });

  test('hides details section when user clicks on "Hide Details" button', async () => {
    const user = userEvent.setup();
    render(<Event event={mockEvent} />);
    
    const showButton = screen.getByRole('button', { name: /show details/i });
    await user.click(showButton);
    
    const hideButton = screen.getByRole('button', { name: /hide details/i });
    await user.click(hideButton);
    
    expect(screen.queryByText('About event:')).not.toBeInTheDocument();
  });
});
