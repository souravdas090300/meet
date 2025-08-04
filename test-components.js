// Simple script to test individual components
import { execSync } from 'child_process';

console.log('Testing individual components...\n');

const components = [
  'Event.test.js',
  'NumberOfEvents.test.js', 
  'CitySearch.test.js'
];

components.forEach(component => {
  try {
    console.log(`\n=== Testing ${component} ===`);
    execSync(`npm test -- ${component} --watchAll=false`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(`✅ ${component} - PASSED`);
  } catch (error) {
    console.log(`❌ ${component} - FAILED`);
    console.log(error.stdout);
  }
});
