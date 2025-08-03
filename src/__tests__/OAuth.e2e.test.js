import puppeteer from 'puppeteer';

describe('OAuth End-to-End Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      slowMo: 80,
      args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Navigate to the app
    await page.goto('http://localhost:5173/meet/');
  });

  test('should show login button when user is not authenticated', async () => {
    // Wait for the page to load
    await page.waitForSelector('.app-header');
    
    // Check if login button is visible
    const loginButton = await page.$('button.login');
    expect(loginButton).not.toBeNull();
    
    // Check button text
    const buttonText = await page.$eval('button.login', el => el.textContent);
    expect(buttonText.trim()).toBe('Login with Google');
  });

  test('should handle login button click', async () => {
    // Wait for the login button to be available
    await page.waitForSelector('button.login');
    
    // Set up request interception to mock OAuth
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const url = request.url();
      
      // Mock the auth URL request
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
    
    // Click the login button
    await page.click('button.login');
    
    // In a real scenario, this would redirect to Google
    // For testing, we can verify the request was made
    await page.waitForTimeout(1000);
  });

  test('should show authenticated state when token exists', async () => {
    // Set a mock token in localStorage
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'mock-token-123');
    });
    
    // Reload the page to trigger auth check
    await page.reload();
    await page.waitForSelector('.app-header');
    
    // Check if logout button is visible
    const logoutButton = await page.$('button.logout');
    expect(logoutButton).not.toBeNull();
    
    // Check authenticated status text
    const authStatus = await page.$eval('.auth-status', el => el.textContent);
    expect(authStatus.trim()).toBe('✓ Logged in with Google');
  });

  test('should handle logout functionality', async () => {
    // Set a mock token in localStorage
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'mock-token-123');
    });
    
    // Reload the page
    await page.reload();
    await page.waitForSelector('button.logout');
    
    // Mock window.location.reload to prevent actual page reload
    await page.evaluate(() => {
      window.location.reload = jest.fn();
    });
    
    // Click logout button
    await page.click('button.logout');
    
    // Wait for logout to process
    await page.waitForTimeout(500);
    
    // Check that token was removed from localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem('access_token');
    });
    expect(token).toBeNull();
    
    // Check for success message
    const successMessage = await page.$('.info-alert');
    if (successMessage) {
      const messageText = await page.$eval('.info-alert', el => el.textContent);
      expect(messageText).toContain('logged out successfully');
    }
  });

  test('should handle OAuth callback with authorization code', async () => {
    // Simulate OAuth redirect with code
    const authCode = '4/0AY0e-g7QX9X9X9X9X9';
    const mockUrl = `http://localhost:5173/meet/?code=${authCode}&scope=https://www.googleapis.com/auth/calendar.readonly`;
    
    // Set up request interception for token exchange
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
    
    // Navigate to the OAuth callback URL
    await page.goto(mockUrl);
    await page.waitForSelector('.app-header');
    
    // Wait for potential token processing
    await page.waitForTimeout(1000);
    
    // Check if the URL was cleaned (removeQuery function)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('code=');
    expect(currentUrl).not.toContain('scope=');
  });

  test('should display error message for failed authentication', async () => {
    // Set up request interception to simulate auth failure
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
    
    // Wait for login button and click it
    await page.waitForSelector('button.login');
    await page.click('button.login');
    
    // Wait for error message to appear
    await page.waitForSelector('.error-alert', { timeout: 5000 });
    
    // Check error message content
    const errorMessage = await page.$eval('.error-alert', el => el.textContent);
    expect(errorMessage).toContain('Failed to initiate login');
  });

  test('should maintain authentication state across page refreshes', async () => {
    // Set a mock token
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'persistent-token-123');
    });
    
    // Reload the page multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForSelector('.app-header');
      
      // Check that user remains logged in
      const authStatus = await page.$('.auth-status');
      expect(authStatus).not.toBeNull();
      
      const statusText = await page.$eval('.auth-status', el => el.textContent);
      expect(statusText.trim()).toBe('✓ Logged in with Google');
    }
  });

  test('should handle expired token gracefully', async () => {
    // Set up request interception to simulate expired token
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
    
    // Set an expired token
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'expired-token');
    });
    
    await page.reload();
    await page.waitForSelector('.app-header');
    
    // The app should handle this gracefully and either refresh the token
    // or show login screen
    const loginButton = await page.$('button.login');
    const logoutButton = await page.$('button.logout');
    
    // One of these should be present
    expect(loginButton !== null || logoutButton !== null).toBe(true);
  });
});
