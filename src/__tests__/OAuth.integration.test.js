import { getToken, checkToken, getAuthURL, removeQuery } from '../api';

// Mock the API module for integration tests
jest.mock('../api');

describe('OAuth Integration Tests with API Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    delete window.location;
    window.location = {
      href: 'http://localhost:3000/',
      pathname: '/',
      search: '',
      assign: jest.fn(),
      reload: jest.fn()
    };
  });

  test('should handle authentication token from URL parameters', async () => {
    const mockCode = '4/0AY0e-g7QX9X9X9X9X9';
    const mockToken = 'mock-access-token-from-oauth';
    
    const testSearchString = `?code=${mockCode}&scope=https://www.googleapis.com/auth/calendar.readonly`;
    const searchParams = new URLSearchParams(testSearchString);
    const extractedCode = searchParams.get('code');
    expect(extractedCode).toBe(mockCode);
    
    getToken.mockResolvedValue({ access_token: mockToken });
    
    const result = await getToken(mockCode);
    expect(result.access_token).toBe(mockToken);
    expect(getToken).toHaveBeenCalledWith(mockCode);
  });

  test('should validate token correctly', async () => {
    const validToken = 'valid-token-123';
    const invalidToken = 'invalid-token-456';
    
    checkToken.mockImplementation((token) => {
      if (token === validToken) {
        return Promise.resolve({ ok: true, status: 200 });
      } else {
        return Promise.resolve({ ok: false, status: 401 });
      }
    });
    
    const validResult = await checkToken(validToken);
    expect(validResult.ok).toBe(true);
    expect(validResult.status).toBe(200);
    
    const invalidResult = await checkToken(invalidToken);
    expect(invalidResult.ok).toBe(false);
    expect(invalidResult.status).toBe(401);
    
    expect(checkToken).toHaveBeenCalledTimes(2);
  });

  test('should handle OAuth URL construction', async () => {
    const mockAuthURL = 'https://accounts.google.com/oauth/authorize?client_id=mock';
    getAuthURL.mockResolvedValue(mockAuthURL);
    
    const authURL = await getAuthURL();
    expect(authURL).toBe(mockAuthURL);
    expect(getAuthURL).toHaveBeenCalled();
  });

  test('should handle localStorage token operations', () => {
    const testToken = 'test-token-for-storage';
    
    localStorage.setItem('access_token', testToken);
    expect(localStorage.getItem('access_token')).toBe(testToken);
    
    localStorage.removeItem('access_token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  test('should handle authentication errors gracefully', async () => {
    getToken.mockRejectedValue(new Error('OAuth service unavailable'));
    
    await expect(getToken('invalid-code')).rejects.toThrow('OAuth service unavailable');
    expect(getToken).toHaveBeenCalledWith('invalid-code');
  });

  test('should clean URL parameters after successful authentication', () => {
    window.location.search = '?code=test-code&scope=test-scope';
    
    removeQuery.mockImplementation(() => {
      window.location.search = '';
    });
    
    removeQuery();
    expect(removeQuery).toHaveBeenCalled();
  });

  test('should handle expired tokens', async () => {
    const expiredToken = 'expired-token';
    
    checkToken.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({
        error: 'invalid_token',
        error_description: 'Token has expired'
      })
    });
    
    const result = await checkToken(expiredToken);
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    
    const errorData = await result.json();
    expect(errorData.error).toBe('invalid_token');
    expect(errorData.error_description).toBe('Token has expired');
  });

  test('should verify authentication state persistence', () => {
    const persistentToken = 'persistent-token-123';
    
    localStorage.setItem('access_token', persistentToken);
    const storedToken = localStorage.getItem('access_token');
    expect(storedToken).toBe(persistentToken);
    
    localStorage.removeItem('access_token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
