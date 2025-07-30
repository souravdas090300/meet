import React from 'react';
import { render, screen } from '@testing-library/react';
import { InfoAlert, ErrorAlert, WarningAlert } from '../components/Alert';

describe('<Alert /> components', () => {
  describe('<InfoAlert /> component', () => {
    test('renders info alert with blue styling', () => {
      render(<InfoAlert text="This is an info message" />);
      const alertElement = screen.getByText('This is an info message');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveStyle({
        color: 'rgb(0, 0, 255)',
        backgroundColor: 'rgb(220, 220, 255)'
      });
    });
  });

  describe('<ErrorAlert /> component', () => {
    test('renders error alert with red styling', () => {
      render(<ErrorAlert text="This is an error message" />);
      const alertElement = screen.getByText('This is an error message');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveStyle({
        color: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(255, 220, 220)'
      });
    });
  });

  describe('<WarningAlert /> component', () => {
    test('renders warning alert with orange styling', () => {
      render(<WarningAlert text="This is a warning message" />);
      const alertElement = screen.getByText('This is a warning message');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveStyle({
        color: 'rgb(255, 165, 0)',
        backgroundColor: 'rgb(255, 235, 205)'
      });
    });
  });
});
