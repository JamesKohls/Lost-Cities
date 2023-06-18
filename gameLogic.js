// gameLogic.js

function createGamestate(){
    let gameState = {
        deck: [],
        player1: {
          hand: [], // array of cards
          expeditions: { // object where each key is a color and each value is an array of cards
            red: [],
            green: [],
            white: [],
            blue: [],
            yellow: [],
          },
        },
        player2: {
          hand: [], // array of cards
          expeditions: { // object where each key is a color and each value is an array of cards
            red: [],
            green: [],
            white: [],
            blue: [],
            yellow: [],
          },
        },
        middle: { // object where each key is a color and each value is an array of cards
            red: [],
            green: [],
            white: [],
            blue: [],
            yellow: [],
        }
    };
    return gameState;
}

// Fisher-Yates Shuffle
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function deal(gameObj) {
    let dealAmount = 8
    while (dealAmount > 0) {
        gameObj.player1.hand.push(gameObj.deck.shift())
        gameObj.player2.hand.push(gameObj.deck.shift())
        dealAmount-- 
    }
}

module.exports = { createGamestate, shuffle, deal };  