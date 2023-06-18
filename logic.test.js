// logic.test.js

// Import the function(s) from main.js
const { add } = require('./main.js');  // Make sure the path to main.js is correct

test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});
