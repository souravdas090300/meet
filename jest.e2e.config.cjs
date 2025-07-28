module.exports = {
  testEnvironment: 'node', // Use Node environment for Puppeteer tests
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.e2e.js'], // Use E2E specific setup
  testMatch: ['**/__tests__/**/EndToEnd.test.js'], // Only run E2E tests
  testTimeout: 30000,
};
