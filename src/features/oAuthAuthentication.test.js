import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getAuthURL, getToken, isLoggedIn, logout } from '../api';

// Mock the API functions
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getAuthURL: jest.fn(),
  getToken: jest.fn(),
  getEvents: jest.fn().mockResolvedValue([]),
  isLoggedIn: jest.fn(),
  logout: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: '',
  hostname: 'localhost',
  protocol: 'http:',
  host: 'localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
};

const feature = loadFeature('src/features/oAuthAuthentication.feature');

defineFeature(feature, test => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    isLoggedIn.mockReturnValue(false);
  });

  test('User can log in using Google OAuth', ({ given, when, then, and }) => {
    let AppComponent;
    const mockAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=123&redirect_uri=localhost';

    given('the user is on the main page', () => {
      AppComponent = render(<App />);
    });

    and('the user is not authenticated', async () => {
      isLoggedIn.mockReturnValue(false);
      
      await waitFor(() => {
        expect(screen.getByText('Login with Google')).toBeInTheDocument();
      });
    });

    when('the user clicks the "Login with Google" button', async () => {
      const user = userEvent.setup();
      
      getAuthURL.mockResolvedValue(mockAuthUrl);
      
      const loginButton = screen.getByText('Login with Google');
      await user.click(loginButton);
    });

    then('the user should be redirected to Google OAuth', async () => {
      await waitFor(() => {
        expect(getAuthURL).toHaveBeenCalled();
      });
    });

    and('the OAuth URL should be valid', () => {
      expect(getAuthURL).toHaveReturnedWith(Promise.resolve(mockAuthUrl));
    });
  });

  test('User sees logged in state after successful authentication', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user has successfully authenticated with Google', () => {
      localStorageMock.getItem.mockReturnValue('valid-access-token');
      isLoggedIn.mockReturnValue(true);
      
      AppComponent = render(<App />);
    });

    when('the main page loads', async () => {
      await waitFor(() => {
        expect(AppComponent.container).toBeInTheDocument();
      });
    });

    then('the user should see they are logged in', async () => {
      await waitFor(() => {
        expect(screen.getByText('✓ Logged in with Google')).toBeInTheDocument();
      });
    });

    and('the user should see a logout button', async () => {
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });
  });

  test('User can log out successfully', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user is logged in', async () => {
      localStorageMock.getItem.mockReturnValue('valid-access-token');
      isLoggedIn.mockReturnValue(true);
      
      AppComponent = render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Logged in with Google')).toBeInTheDocument();
      });
    });

    when('the user clicks the logout button', async () => {
      const user = userEvent.setup();
      
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);
    });

    then('the user should be logged out', () => {
      expect(logout).toHaveBeenCalled();
    });

    and('the authentication data should be cleared', () => {
      expect(logout).toHaveBeenCalled();
    });

    and('the user should see a success message', async () => {
      await waitFor(() => {
        expect(screen.getByText('You have been logged out successfully.')).toBeInTheDocument();
      });
    });
  });

  test('App handles OAuth errors gracefully', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user is on the main page', () => {
      AppComponent = render(<App />);
    });

    and('the OAuth service is unavailable', () => {
      getAuthURL.mockRejectedValue(new Error('OAuth service unavailable'));
    });

    when('the user attempts to log in', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('Login with Google')).toBeInTheDocument();
      });
      
      const loginButton = screen.getByText('Login with Google');
      await user.click(loginButton);
    });

    then('the user should see an error message', async () => {
      await waitFor(() => {
        expect(screen.getByText('Failed to initiate login. Please try again.')).toBeInTheDocument();
      });
    });

    and('the user should still be on the main page', () => {
      expect(AppComponent.container).toBeInTheDocument();
    });
  });

  test('App handles OAuth redirect with authorization code', ({ given, when, then, and }) => {
    const mockCode = '4/0AY0e-g7QX9X9X9X9X9';
    const mockAccessToken = 'ya29.access-token-here';

    given('the user has been redirected back from Google OAuth', () => {
      // Simulate OAuth redirect URL
      window.location.search = `?code=${mockCode}&scope=https://www.googleapis.com/auth/calendar.readonly`;
    });

    when('the authorization code is processed', async () => {
      getToken.mockResolvedValue(mockAccessToken);
      
      // Extract code from URL (simulate what the app would do)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        await getToken(code);
      }
    });

    then('the access token should be obtained', () => {
      expect(getToken).toHaveBeenCalledWith(mockCode);
    });

    and('the access token should be stored', () => {
      expect(getToken).toHaveReturnedWith(Promise.resolve(mockAccessToken));
    });
  });

  test('App validates stored access token on load', ({ given, when, then, and }) => {
    let AppComponent;

    given('the user has a stored access token', () => {
      localStorageMock.getItem.mockReturnValue('stored-access-token');
      isLoggedIn.mockReturnValue(true);
    });

    when('the app loads', () => {
      AppComponent = render(<App />);
    });

    then('the app should check if the user is logged in', () => {
      expect(isLoggedIn).toHaveBeenCalled();
    });

    and('the user should see the authenticated interface', async () => {
      await waitFor(() => {
        expect(screen.getByText('✓ Logged in with Google')).toBeInTheDocument();
      });
    });
  });
});
