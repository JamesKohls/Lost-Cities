let cards = require('./cards.json');

console.log(cards); 





// main.js
function add(a, b) {
    return a + b;
}

// other functions...

// Make sure to export the function(s) you want to test
module.exports = { add };  // If you have multiple functions, add them to the object: { add, func1, func2, ... }
