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
        discard: { // object where each key is a color and each value is an array of cards
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

function play(gameObj, cardIndex, position) {
    // grab the selected card, remove it from deck
    let selectedCard = gameObj.player1.hand.splice(cardIndex, 1)[0];
    // move card to specified location
    if (position[0] == "expeditions") {
        gameObj.player1.expeditions[position[1]].push(selectedCard);
    } else if (position[0] == "discard") {
        gameObj.discard[position[1]].push(selectedCard);
    }
}

function draw(gameObj, position){
    if (position[0] == "deck") {
        gameObj.player1.hand.push(gameObj.deck.shift());
    } else if (position[0] == "discard") {
        let selectedCard = gameObj.discard[position[1]].shift();
        gameObj.player1.hand.push(selectedCard);
    }
}

module.exports = { createGamestate, shuffle, deal, play, draw };  