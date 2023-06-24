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

var indexDict = {
    0: "red",
    1: "green",
    2: "white",
    3: "blue",
    4: "yellow"
};

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

function play(gameObj, playString) {
    let inputArr = playString.split(" ");
    let selectedCard = gameObj.player1.hand.splice(inputArr[1], 1)[0];
    if (inputArr[0] == 'play') {
        gameObj.player1.expeditions[indexDict[inputArr[2]]].push(selectedCard);
    } else if (inputArr[0] == 'discard') {
        gameObj.discard[indexDict[inputArr[2]]].push(selectedCard);
    } 
}

function draw(gameObj, drawString){
    let inputArr = drawString.split(" ");
    if (inputArr[0] == "draw") {
        gameObj.player1.hand.push(gameObj.deck.shift());
    } else if (inputArr[0] == "discard") {
        let selectedCard = gameObj.discard[inputArr[1]].shift();
        gameObj.player1.hand.push(selectedCard);
    }
}

module.exports = { createGamestate, shuffle, deal, play, draw };  