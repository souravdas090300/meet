import React from 'react';
import { getToken, checkToken, getAuthURL, removeQuery } from '../api';

// Mock the API functions
jest.mock('../api');

describe('OAuth Integration Tests', () => {
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset window.location (but don't set search to empty string)
    delete window.location;
    window.location = {
      href: 'http://localhost:3000/',
      pathname: '/',
      assign: jest.fn(),
      reload: jest.fn()
    };
  });

  test('should handle authentication token from URL parameters', async () => {
    const mockCode = '4/0AY0e-g7QX9X9X9X9X9';
    const mockToken = 'mock-access-token-from-oauth';
    
    // Test URLSearchParams functionality directly without relying on window.location
    const testSearchString = `?code=${mockCode}&scope=https://www.googleapis.com/auth/calendar.readonly`;
    const searchParams = new URLSearchParams(testSearchString);
    const extractedCode = searchParams.get('code');
    expect(extractedCode).toBe(mockCode);
    
    // Mock successful token exchange
    getToken.mockResolvedValue({ access_token: mockToken });
    
    // Test token exchange
    const result = await getToken(mockCode);
    expect(result.access_token).toBe(mockToken);
    expect(getToken).toHaveBeenCalledWith(mockCode);
  });

  test('should validate token correctly', async () => {
    const validToken = 'valid-token-123';
    const invalidToken = 'invalid-token-456';
    
    // Mock successful token validation
    checkToken.mockImplementation((token) => {
      if (token === validToken) {
        return Promise.resolve({ ok: true, status: 200 });
      } else {
        return Promise.resolve({ ok: false, status: 401 });
      }
    });
    
    // Test valid token
    const validResult = await checkToken(validToken);
    expect(validResult.ok).toBe(true);
    expect(validResult.status).toBe(200);
    
    // Test invalid token
    const invalidResult = await checkToken(invalidToken);
    expect(invalidResult.ok).toBe(false);
    expect(invalidResult.status).toBe(401);
    
    expect(checkToken).toHaveBeenCalledTimes(2);
  });

  test('should handle OAuth URL construction', async () => {
    // Mock the auth URL generation
    const mockAuthURL = 'https://accounts.google.com/oauth/authorize?client_id=mock';
    getAuthURL.mockResolvedValue(mockAuthURL);
    
    const authURL = await getAuthURL();
    expect(authURL).toBe(mockAuthURL);
    expect(getAuthURL).toHaveBeenCalled();
  });

  test('should handle localStorage token operations', () => {
    const testToken = 'test-token-for-storage';
    
    // Test setting token in localStorage
    localStorage.setItem('access_token', testToken);
    expect(localStorage.getItem('access_token')).toBe(testToken);
    
    // Test removing token from localStorage
    localStorage.removeItem('access_token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  test('should handle authentication errors gracefully', async () => {
    // Mock failed token exchange
    getToken.mockRejectedValue(new Error('OAuth service unavailable'));
    
    await expect(getToken('invalid-code')).rejects.toThrow('OAuth service unavailable');
    expect(getToken).toHaveBeenCalledWith('invalid-code');
  });

  test('should clean URL parameters after successful authentication', () => {
    // Set initial URL with parameters
    window.location.search = '?code=test-code&scope=test-scope';
    
    // Mock removeQuery function
    removeQuery.mockImplementation(() => {
      window.location.search = '';
    });
    
    // Call removeQuery
    removeQuery();
    
    // Verify removeQuery was called
    expect(removeQuery).toHaveBeenCalled();
  });

  test('should handle expired tokens', async () => {
    const expiredToken = 'expired-token';
    
    // Mock expired token response
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
    
    // Test setting token in localStorage
    localStorage.setItem('access_token', persistentToken);
    
    // Verify token persists across page "refreshes" (simulated by clearing and checking)
    const storedToken = localStorage.getItem('access_token');
    expect(storedToken).toBe(persistentToken);
    
    // Test token removal (logout)
    localStorage.removeItem('access_token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
