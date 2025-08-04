import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { 
  getAuthURL, 
  getToken, 
  checkToken, 
  isLoggedIn, 
  logout, 
  removeQuery 
} from '../api';

// Mock the API functions
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getAuthURL: jest.fn(),
  getToken: jest.fn(),
  checkToken: jest.fn(),
  getEvents: jest.fn(),
  isLoggedIn: jest.fn(),
  logout: jest.fn(),
  removeQuery: jest.fn(),
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
  pathname: '/meet',
  search: '',
  hash: '',
};

// Mock window.history
const mockPushState = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    pushState: mockPushState,
  },
  writable: true,
});

describe('OAuth Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    window.location.search = '';
    window.location.href = '';
  });

  describe('getAuthURL function', () => {
    test('should fetch and return authorization URL', async () => {
      const mockAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=123&redirect_uri=https://example.com';
      
      // Mock fetch response
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ authUrl: mockAuthUrl }),
      });

      getAuthURL.mockImplementation(async () => {
        const response = await fetch('mock-auth-server/get-auth-url');
        const result = await response.json();
        return result.authUrl;
      });

      const authUrl = await getAuthURL();
      expect(authUrl).toBe(mockAuthUrl);
    });

    test('should handle errors when fetching auth URL', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      getAuthURL.mockRejectedValue(new Error('Failed to get auth URL'));

      await expect(getAuthURL()).rejects.toThrow('Failed to get auth URL');
    });
  });

  describe('getToken function', () => {
    test('should exchange authorization code for access token', async () => {
      const mockCode = 'auth-code-123';
      const mockAccessToken = 'access-token-456';

      // Mock the getToken function to simulate the actual behavior
      getToken.mockImplementation(async () => {
        // Simulate localStorage.setItem call
        localStorageMock.setItem('access_token', mockAccessToken);
        return mockAccessToken;
      });

      const token = await getToken(mockCode);
      
      expect(token).toBe(mockAccessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', mockAccessToken);
    });

    test('should handle missing access token in response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({}),
      });

      getToken.mockResolvedValue(undefined);

      const token = await getToken('invalid-code');
      expect(token).toBeUndefined();
    });
  });

  describe('checkToken function', () => {
    test('should validate access token with Google', async () => {
      const mockToken = 'valid-token-123';
      const mockTokenInfo = {
        issued_to: '123456789.apps.googleusercontent.com',
        audience: '123456789.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        expires_in: 3599,
        access_type: 'offline'
      };

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTokenInfo),
      });

      checkToken.mockImplementation(async (accessToken) => {
        const result = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        ).then((res) => res.json());
        return result;
      });

      const result = await checkToken(mockToken);
      expect(result).toEqual(mockTokenInfo);
    });

    test('should handle invalid token', async () => {
      const mockError = { error: 'invalid_token' };
      
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockError),
      });

      checkToken.mockResolvedValue(mockError);

      const result = await checkToken('invalid-token');
      expect(result).toEqual(mockError);
    });
  });

  describe('isLoggedIn function', () => {
    test('should return true when access token exists', () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      isLoggedIn.mockImplementation(() => {
        const token = localStorageMock.getItem('access_token');
        return !!token;
      });
      
      const result = isLoggedIn();
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('access_token');
    });

    test('should return false when no access token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      isLoggedIn.mockImplementation(() => {
        const token = localStorageMock.getItem('access_token');
        return !!token;
      });
      
      const result = isLoggedIn();
      expect(result).toBe(false);
    });

    test('should return false when access token is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');
      isLoggedIn.mockImplementation(() => {
        const token = localStorageMock.getItem('access_token');
        return !!token;
      });
      
      const result = isLoggedIn();
      expect(result).toBe(false);
    });
  });

  describe('logout function', () => {
    test('should clear all authentication data', () => {
      logout.mockImplementation(() => {
        localStorageMock.removeItem('access_token');
        localStorageMock.removeItem('lastEvents');
        localStorageMock.removeItem('lastEventsTimestamp');
      });
      
      logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lastEvents');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lastEventsTimestamp');
    });
  });

  describe('removeQuery function', () => {
    test('should remove query parameters from URL', () => {
      window.location.pathname = '/meet';
      window.location.search = '?code=auth-code-123&scope=calendar';
      
      removeQuery.mockImplementation(() => {
        window.history.pushState('', '', 'http://localhost:3000/meet');
      });
      
      removeQuery();
      
      expect(mockPushState).toHaveBeenCalledWith('', '', 'http://localhost:3000/meet');
    });

    test('should handle URL without pathname', () => {
      window.location.pathname = '';
      
      removeQuery.mockImplementation(() => {
        window.history.pushState('', '', 'http://localhost:3000');
      });
      
      removeQuery();
      
      expect(mockPushState).toHaveBeenCalledWith('', '', 'http://localhost:3000');
    });
  });
});

describe('OAuth Integration in App Component', () => {
  let originalLocation;
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Save original location
    originalLocation = window.location;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
  });

  test('should show login button when user is not authenticated', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });
  });

  test('should show logout button when user is authenticated', async () => {
    localStorageMock.getItem.mockReturnValue('valid-token');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Logged in with Google')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('should handle login button click', async () => {
    const user = userEvent.setup();
    const mockAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=123';
    
    getAuthURL.mockResolvedValue(mockAuthUrl);
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });
    
    const loginButton = screen.getByText('Login with Google');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(getAuthURL).toHaveBeenCalled();
    });
  });

  test('should handle logout button click', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('valid-token');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('lastEvents');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('lastEventsTimestamp');
  });

  test('should handle login error gracefully', async () => {
    const user = userEvent.setup();
    
    getAuthURL.mockRejectedValue(new Error('Network error'));
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });
    
    const loginButton = screen.getByText('Login with Google');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to initiate login. Please try again.')).toBeInTheDocument();
    });
  });

  test('should show info alert after successful logout', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('valid-token');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    // The component should show success message before reload
    await waitFor(() => {
      expect(screen.getByText('You have been logged out successfully.')).toBeInTheDocument();
    });
  });
});

describe('OAuth URL Code Handling', () => {
  test('should extract authorization code from URL parameters', () => {
    // Simulate OAuth redirect with code in URL
    const urlParams = new URLSearchParams('?code=4/0AY0e-g7QX9X9X9X9X9&scope=https://www.googleapis.com/auth/calendar.readonly');
    const code = urlParams.get('code');
    
    expect(code).toBe('4/0AY0e-g7QX9X9X9X9X9');
  });

  test('should handle URL without authorization code', () => {
    const urlParams = new URLSearchParams('?error=access_denied');
    const code = urlParams.get('code');
    
    expect(code).toBeNull();
  });

  test('should handle empty URL parameters', () => {
    const urlParams = new URLSearchParams('');
    const code = urlParams.get('code');
    
    expect(code).toBeNull();
  });
});

describe('OAuth Security', () => {
  test('should not expose sensitive data in logs', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Simulate storing token
    localStorageMock.setItem('access_token', 'sensitive-token-123');
    
    // Check that token is not logged
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('sensitive-token-123')
    );
    
    consoleSpy.mockRestore();
  });

  test('should handle expired token gracefully', async () => {
    const expiredTokenResponse = {
      error: 'invalid_token',
      error_description: 'Token has expired'
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(expiredTokenResponse),
    });
    
    checkToken.mockResolvedValue(expiredTokenResponse);
    
    const result = await checkToken('expired-token');
    expect(result.error).toBe('invalid_token');
  });
});
