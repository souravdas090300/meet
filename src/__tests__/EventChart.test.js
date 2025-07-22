import React from 'react';
import { render, screen } from '@testing-library/react';
import EventChart from '../components/EventChart';

// Mock data for testing
const mockEvents = [
  {
    id: '1',
    location: 'London, UK',
    summary: 'Learn JavaScript'
  },
  {
    id: '2',
    location: 'Berlin, Germany',
    summary: 'React is Fun'
  },
  {
    id: '3',
    location: 'London, UK',
    summary: 'Node.js Workshop'
  },
  {
    id: '4',
    location: 'New York, USA',
    summary: 'Angular Fundamentals'
  }
];

// Mock recharts components to avoid issues with rendering in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ScatterChart: ({ children }) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => <div data-testid="scatter" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}));

describe('<EventChart />', () => {
  describe('Feature 6: Display Charts Visualizing Event Details', () => {
    test('Scenario 1: Show a chart with the number of upcoming events in each city', () => {
      render(<EventChart events={mockEvents} />);
      
      // Check if the main chart title is rendered
      expect(screen.getByText('Number of Upcoming Events by City')).toBeInTheDocument();
      
      // Check if the bar chart is rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      // Check if chart components are present (use getAllByTestId for multiple elements)
      expect(screen.getByTestId('bar')).toBeInTheDocument();
      expect(screen.getAllByTestId('x-axis')).toHaveLength(2); // Bar chart and scatter chart
      expect(screen.getAllByTestId('y-axis')).toHaveLength(2);
      expect(screen.getAllByTestId('cartesian-grid')).toHaveLength(2);
      expect(screen.getAllByTestId('tooltip')).toHaveLength(3); // Bar, scatter, and pie charts
    });

    test('renders scatter plot chart', () => {
      render(<EventChart events={mockEvents} />);
      
      // Check if the scatter plot title is rendered
      expect(screen.getByText('Events Distribution (Scatter Plot)')).toBeInTheDocument();
      
      // Check if the scatter chart is rendered
      expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
      expect(screen.getByTestId('scatter')).toBeInTheDocument();
    });

    test('renders pie chart for event genres', () => {
      render(<EventChart events={mockEvents} />);
      
      // Check if the pie chart title is rendered
      expect(screen.getByText('Events by Genre')).toBeInTheDocument();
      
      // Check if the pie chart is rendered
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
    });

    test('handles empty events array', () => {
      render(<EventChart events={[]} />);
      
      // Chart should still render with titles even with no data
      expect(screen.getByText('Number of Upcoming Events by City')).toBeInTheDocument();
      expect(screen.getByText('Events Distribution (Scatter Plot)')).toBeInTheDocument();
      expect(screen.getByText('Events by Genre')).toBeInTheDocument();
    });
  });
});
