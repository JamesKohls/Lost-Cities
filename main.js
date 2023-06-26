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
    // assign name(s)
    let p1 = await readLineAsync('Please enter your name (default player1): ');
    p1 = p1 || 'Player1'; // If the user doesn't provide a name, use 'Player1' by default
    gameState.player1.name = p1
    console.log(`Welcome, ${p1}!`);

    let p2 = await readLineAsync('Please enter your name (default player2): ');
    p2 = p2 || 'Player2'; // If the user doesn't provide a name, use 'Player1' by default
    console.log(`Welcome, ${p2}!\n`);
    gameState.player2.name = p2

    // deal the cards
    game.deal(gameState)

    while(true) {
        //console.log(ui.printDiscard(gameState.discard))
        //console.log(ui.printBoard(gameState).toString())
        console.log(`-- ${gameState[gameState.turn].name}'s TURN-- \n`)

        console.log("DISCARD") 
        console.log(gameState.discard, "\n")
        console.log(`${gameState[gameState.turn].name}'s EXPEDITIONS`)
        console.log(gameState[gameState.turn].expeditions, "\n")
        console.log("HAND")
        console.log(ui.printHand(gameState[gameState.turn].hand).toString(), "\n");

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
            console.log("input: draw OR discard (expedition), enter: draw");
            let drawString = await readLineAsync("");
            if (drawString == ''){
                game.draw(gameState, "draw");
                break;
            }
            try {
                game.draw(gameState, drawString);
                break;
            } 
            catch (error) {
                console.log(colors.red(error.message));
            }
        }
        // go next
        game.turn(gameState)
    }
}

startApp().catch(console.error);

