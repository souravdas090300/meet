// Setup file for End-to-End tests with Puppeteer
// No jsdom imports here since Puppeteer runs in Node environment

const MESSAGES_TO_IGNORE = [
  "Warning:",
  "ws does not work in the browser",
  "WebSocket",
  "ChromeLauncher"
];

const originalError = console.error.bind(console.error);
const originalWarn = console.warn.bind(console.warn);

console.error = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find(message => args.toString().includes(message));
  if (!ignoreMessage) originalError(...args);
}

console.warn = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find(message => args.toString().includes(message));
  if (!ignoreMessage) originalWarn(...args);
}

jest.setTimeout(30000);
