// gameLogic.js
var colors = require('@colors/colors');

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
    if (inputArr.length !== 2) {
        throw new Error(colors.red("Invalid input. Please enter 'play (handIndex)' or 'discard (handIndex)'"));
      }
    else {
        action = inputArr[0].toLowerCase();
        handIndex = parseInt(inputArr[1]);
    
        if (action !== "play" && action !== "discard") {
            throw new Error(colors.red("Invalid action. Please enter 'play (handIndex)' or 'discard (handIndex)'"));
        }       
    
        else if (isNaN(handIndex) || handIndex < 0 || handIndex > 7) {
            throw new Error(colors.red("Invalid hand index. Please enter a number from 0 to 7 for handIndex."));
        }
        else {
            let selectedCard = gameObj.player1.hand.splice(inputArr[1], 1)[0];
    
            if (action == 'play') {
                gameObj.player1.expeditions[selectedCard.color].push(selectedCard);
            } 
            else if (action == 'discard') {
                gameObj.discard[selectedCard.color].push(selectedCard);
            } 
        }
    } 
}

function draw(gameObj, drawString){
    let inputArr = drawString.split(" ");
    action = inputArr[0].toLowerCase();
    if (action != "draw" && action != "discard" || inputArr.length > 2) {
        throw new Error(colors.red("Invalid input. Please enter 'draw' or 'discard (expedition)'."));
    }
                
    if (action == "draw") {
        if (inputArr.length > 1) {
            throw new Error(colors.red("Invalid input. Please enter only 'draw' for drawing from the deck."));
        }
        else {
            gameObj.player1.hand.push(gameObj.deck.shift());
        }
    }
    if (action == "discard") {
        expedition = inputArr[1].toLowerCase();
        const validExpeditions = ["red", "green", "white", "blue", "yellow"];
        if (inputArr.length !== 2) {
            throw new Error(colors.red("Invalid input. Please enter 'discard (expedition)'."));
        }           
        else if (!validExpeditions.includes(expedition)) {
            throw new Error(colors.red("Invalid expedition. Please enter one of the following colors: red, green, white, blue, yellow."));
        }
        else {
            let selectedCard = gameObj.discard[expedition].shift();
            gameObj.player1.hand.push(selectedCard);
        }
    }  
}

module.exports = { createGamestate, shuffle, deal, play, draw };  