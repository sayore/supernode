// Simple test to verify that the index.ts files work correctly
import { Base, Game, Math } from './dist/main.js';

console.log('Testing import from Base module:');
console.log('Base module has Application:', typeof Base.Application !== 'undefined');

console.log('\nTesting import from Game module:');
console.log('Game module has Item:', typeof Game.Item !== 'undefined');

console.log('\nTesting import from Math module:');
console.log('Math module has Vector2:', typeof Math.Vector2 !== 'undefined');

console.log('\nAll imports successful!');