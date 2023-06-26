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
    let scores = {player1: 0, player2: 0};
    let expeditions1 = gameObj.player1.expeditions;
    let expeditions2 = gameObj.player2.expeditions;

    // player 1
    for (let color in expeditions1) {
        let expedition1 = expeditions1[color];
        let sum1 = 0;
        let wagercount1 = 0;
        
        // if an expedition has no card, then the expedition score should be 0 (not -20)
        if (expedition1.length == 0) {
            scores.player1 += 0;
            continue;
        }

        // if an expedition has at least 1 card, then the expedition score should be calculated based on the following function:
        // expedition score = (-20 + sum of the value of all cards in the expedition) * (number of wager cards in the expedition + 1)
        for (let card of expedition1) {
            sum1 += card.value;
            if (card.value == 0) {
                wagercount1++;
            }
        }
        let expeditionScore1 = (-20 + sum1) * (wagercount1 + 1);
        scores.player1 += expeditionScore1;
    }

    // player 2
    for (let color in expeditions2) {
        let expedition2 = expeditions2[color];
        let sum2 = 0;
        let wagercount2 = 0;
        
        // if an expedition has no card, then the expedition score should be 0 (not -20)
        if (expedition2.length == 0) {
            scores.player2 += 0;
            continue;
        }

        // if an expedition has at least 1 card, then the expedition score should be calculated based on the following function:
        // expedition score = (-20 + sum of the value of all cards in the expedition) * (number of wager cards in the expedition + 1)
        for (let card of expedition2) {
            sum2 += card.value;
            if (card.value == 0) {
                wagercount2++;
            }
        }
        let expeditionScore2 = (-20 + sum2) * (wagercount2 + 1);
        scores.player2 += expeditionScore2;
    }

    return scores;
}

module.exports = { createGamestate, shuffle, deal, play, draw, turn, score};  