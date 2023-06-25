// main.js
const game = require('./gameLogic.js'); 
const ui = require('./uiLogic.js'); 
const readline = require('readline');
let deck = require('./cards.json');
const Table = require('cli-table3');
var colors = require('@colors/colors');

console.log("Welcome to Lost Cities");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readLineAsync = msg => {
    return new Promise(resolve => {
        rl.question(msg, userRes => {
            resolve(userRes);
        });
    });    
}


const startApp = async () => {
    // shuffe deck
    let gameState = game.createGamestate()
    gameState.deck = game.shuffle(deck)
    // assign name
    let playerName = await readLineAsync('Please enter your name (default player1): ');
    playerName = playerName || 'Player1'; // If the user doesn't provide a name, use 'Player1' by default
    console.log(`Welcome, ${playerName}!`);
    // deal the cards
    game.deal(gameState)

    while(true) {
        //console.log(ui.printDiscard(gameState.discard))
        //console.log(ui.printBoard(gameState).toString())
        console.log("DISCARD")
        console.log(gameState.discard)
        console.log("EXPEDITIONS")
        console.log(gameState.player1.expeditions)
        console.log("HAND")
        //console.log(ui.printHand(gameState.player1.hand))
        console.log(ui.printHand(gameState.player1.hand).toString());

        // Ask the user to play/discard a card from hand
        while (true) {
            console.log("input: (play/discard) (handIndex)");
            let playString = await readLineAsync("");
            try {
                game.play(gameState, playString);
                break;
            } 
            catch (error) {
                console.log(colors.red(error.message));
            }
        }

        // Ask the user to draw a card from the deck or from the expedition

        while (true) {
            console.log("input: draw OR discard (expedition)");
            let drawString = await readLineAsync("");
            try {
                game.draw(gameState, drawString);
                break;
            } 
            catch (error) {
                console.log(colors.red(error.message));
            }
        }



    }
}

startApp().catch(console.error);

