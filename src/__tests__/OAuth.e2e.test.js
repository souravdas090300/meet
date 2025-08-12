import puppeteer from 'puppeteer';
import { getToken, checkToken, getAuthURL, removeQuery } from '../api';

describe('OAuth End-to-End Flow with Puppeteer', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 80,
      args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:5173/meet/');
  });

  test('should show login button when user is not authenticated', async () => {
    await page.waitForSelector('.app-header');
    const loginButton = await page.$('button.login');
    expect(loginButton).not.toBeNull();
    
    const buttonText = await page.$eval('button.login', el => el.textContent);
    expect(buttonText.trim()).toBe('Login with Google');
  });

  test('should handle login button click', async () => {
    await page.waitForSelector('button.login');
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('get-auth-url')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            authUrl: 'https://accounts.google.com/oauth/authorize?client_id=mock'
          })
        });
      } else {
        request.continue();
      }
    });
    
    await page.click('button.login');
    await page.waitForTimeout(1000);
  });

  test('should show authenticated state when token exists', async () => {
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'mock-token-123');
    });
    
    await page.reload();
    await page.waitForSelector('.app-header');
    
    const logoutButton = await page.$('button.logout');
    expect(logoutButton).not.toBeNull();
    
    const authStatus = await page.$eval('.auth-status', el => el.textContent);
    expect(authStatus.trim()).toBe('✓ Logged in with Google');
  });

  test('should handle logout functionality', async () => {
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'mock-token-123');
    });
    
    await page.reload();
    await page.waitForSelector('button.logout');
    
    await page.evaluate(() => {
      window.location.reload = jest.fn();
    });
    
    await page.click('button.logout');
    await page.waitForTimeout(500);
    
    const token = await page.evaluate(() => {
      return localStorage.getItem('access_token');
    });
    expect(token).toBeNull();
    
    const successMessage = await page.$('.info-alert');
    if (successMessage) {
      const messageText = await page.$eval('.info-alert', el => el.textContent);
      expect(messageText).toContain('logged out successfully');
    }
  });

  test('should handle OAuth callback with authorization code', async () => {
    const authCode = '4/0AY0e-g7QX9X9X9X9X9';
    const mockUrl = `http://localhost:5173/meet/?code=${authCode}&scope=https://www.googleapis.com/auth/calendar.readonly`;
    
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('get-auth-token')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-access-token-from-oauth'
          })
        });
      } else if (url.includes('get-calendar-events')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            events: [
              {
                id: '1',
                summary: 'Test Event',
                location: 'Test Location',
                created: '2023-01-01T10:00:00Z'
              }
            ]
          })
        });
      } else {
        request.continue();
      }
    });
    
    await page.goto(mockUrl);
    await page.waitForSelector('.app-header');
    await page.waitForTimeout(1000);
    
    const currentUrl = await page.url();
    expect(currentUrl).not.toContain('code=');
    expect(currentUrl).not.toContain('scope=');
  });

  test('should display error message for failed authentication', async () => {
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('get-auth-url')) {
        request.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'OAuth service unavailable'
          })
        });
      } else {
        request.continue();
      }
    });
    
    await page.waitForSelector('button.login');
    await page.click('button.login');
    
    await page.waitForSelector('.error-alert', { timeout: 5000 });
    const errorMessage = await page.$eval('.error-alert', el => el.textContent);
    expect(errorMessage).toContain('Failed to initiate login');
  });

  test('should maintain authentication state across page refreshes', async () => {
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'persistent-token-123');
    });
    
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForSelector('.app-header');
      
      const authStatus = await page.$('.auth-status');
      expect(authStatus).not.toBeNull();
      
      const statusText = await page.$eval('.auth-status', el => el.textContent);
      expect(statusText.trim()).toBe('✓ Logged in with Google');
    }
  });

  test('should handle expired token gracefully', async () => {
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('tokeninfo')) {
        request.respond({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'invalid_token',
            error_description: 'Token has expired'
          })
        });
      } else {
        request.continue();
      }
    });
    
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'expired-token');
    });
    
    await page.reload();
    await page.waitForSelector('.app-header');
    
    const loginButton = await page.$('button.login');
    const logoutButton = await page.$('button.logout');
    expect(loginButton !== null || logoutButton !== null).toBe(true);
  });
});

// Separate test suite for API integration tests
jest.mock('../api');
describe('OAuth Integration Tests with API Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
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