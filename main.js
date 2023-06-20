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
    game.deal(gameState)

    while(1) {
        console.log(ui.printDiscard(gameState.discard))
        console.log(ui.printExpedtions(gameState.player1.expeditions))
        console.log("current hand")
        console.log(ui.printHand(gameState.player1.hand))

        // Ask the user to place a card
        console.log("Please place a card...");
        let cardIndex = await readLineAsync('Enter the index of the card you want to place: ');
        let placePosition = await readLineAsync('Enter the position where you want to place the card (e for expeditions, d for discard): ');
        let color = await readLineAsync('Enter the color of the card: ');
        game.play(gameState, cardIndex, [placePosition, color]);

        // Ask the user to draw a card
        console.log("Please draw a card...");
        let drawPosition = await readLineAsync('Enter the position where you want to draw a card from (d for deck, discard for discard): ');
        color = drawPosition === 'd' ? null : await readLineAsync('Enter the color of the card: ');
        game.draw(gameState, [drawPosition, color]);
    }


}

startApp().catch(console.error);
