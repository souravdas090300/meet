import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';

const mockEvent = {
  id: '1',
  summary: 'Learn JavaScript',
  created: '2020-05-19T19:17:46.000Z',
  location: 'London, UK',
  htmlLink: 'https://example.com',
  description: 'JavaScript workshop for beginners'
};

describe('<Event /> component', () => {
  test('renders event element', () => {
    render(<Event event={mockEvent} />);
    expect(screen.getByText('Learn JavaScript')).toBeInTheDocument();
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
