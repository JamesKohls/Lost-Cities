// gameLogic.js
var colors = require('@colors/colors');

function createGamestate(){
    let gameState = {
        turn: "player1",
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
            let selectedCard = gameObj[gameObj.turn].hand.splice(inputArr[1], 1)[0];
            let deckLength = gameObj[gameObj.turn].expeditions[selectedCard.color].length
        
            if (action == 'play') {
                let curVal = gameObj[gameObj.turn].expeditions[selectedCard.color][deckLength-1]
                if (curVal) {
                    if (curVal.value > selectedCard.value) {
                        throw new Error(colors.red("Invalid Move: cannot place card of lower value"));
                    }
                }
                gameObj[gameObj.turn].expeditions[selectedCard.color].push(selectedCard);         
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
            // case where deck in empty, but game should automatically end
            gameObj[gameObj.turn].hand.push(gameObj.deck.shift());
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
            if (gameObj.discard[expedition].length > 0){
                let selectedCard = gameObj.discard[expedition].shift();
                gameObj[gameObj.turn].hand.push(selectedCard);
            } else {
                throw new Error(colors.red("Invalid Move: pile is empty"));
            }

        }
    }  
}

function turn(gameObj){
    if (gameObj.turn == 'player1'){
        gameObj.turn = 'player2'
    } else {
        gameObj.turn = 'player1'
    }
}

function score(gameObj) {
    let totalScore = 0;
    let turn = gameObj.turn;
    let expeditions = gameObj[turn].expeditions;

    for (let color in expeditions) {
        let expedition = expeditions[color];
        let sum = 0;
        let wagercount = 0;
        
        if (expedition.length == 0) {
            totalScore += 0;
            continue;
        }
        
        for (let card of expedition) {
            sum += card.value;
            if (card.value == 0) {
                wagercount++;
            }
        }

        let expeditionScore = (-20 + sum) * (wagercount + 1);
        totalScore += expeditionScore;
    }
    return totalScore;
}

module.exports = { createGamestate, shuffle, deal, play, draw, turn, score};  