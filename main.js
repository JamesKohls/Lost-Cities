// main.js
const game = require('./gameLogic.js'); 
const ui = require('./uiLogic.js'); 
const readline = require('readline');
let deck = require('./cards.json');

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

    console.log(ui.printMiddle(gameState.middle))

    game.deal(gameState)
    console.log(ui.printExpedtions(gameState.player1.expeditions))

    console.log("current hand")
    console.log(ui.printHand(gameState.player1.hand))
    
    //await readLineAsync('Press Enter to deal cards...');
    // You can add more prompts here
    // e.g., await readLineAsync('Press Enter to deal cards...');
    // Remember to close the readline interface when you're done:
    // rl.close();
}

startApp().catch(console.error);
