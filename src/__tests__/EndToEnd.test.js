import puppeteer from 'puppeteer';

describe('show/hide event details', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode for faster testing
      slowMo: 100, // Reduced slow down for faster execution
      timeout: 0 // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto('http://localhost:5173/meet/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide details', async () => {
    // First, make sure details are expanded 
    await page.waitForSelector('.event .event-details');
    // Then click to collapse
    await page.click('.event .details-btn');
    // Wait a bit for the state to change
    await page.waitForFunction(
      () => !document.querySelector('.event .event-details')
    );
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });
});

describe('filter events by city', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode for faster testing
      slowMo: 100, // Reduced slow down for faster execution
      timeout: 0
    });
    page = await browser.newPage();
    await page.goto('http://localhost:5173/meet/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('When user hasn\'t searched for a city, show upcoming events from all cities', async () => {
    const events = await page.$$('.event');
    expect(events).toHaveLength(5);
  });

  test('User should see a list of suggestions when they search for a city', async () => {
    await page.type('#city-search input', 'Berlin');
    await page.waitForSelector('.suggestions li');
    const suggestions = await page.$$('.suggestions li');
    expect(suggestions).toHaveLength(2);
  });

  test('User can select a city from the suggested list', async () => {
    // Clear previous input
    await page.click('#city-search input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    // Type Berlin
    await page.type('#city-search input', 'Berlin');
    await page.waitForSelector('.suggestions li');
    
    // Click on first suggestion
    await page.click('.suggestions li:first-child');
    
    // Check that input value changed
    const inputValue = await page.$eval('#city-search input', el => el.value);
    expect(inputValue).toBe('Berlin, Germany');
    
    // Wait for events to load and check count
    await page.waitForSelector('.event');
    const events = await page.$$('.event');
    expect(events.length).toBeGreaterThan(0);
  });
});