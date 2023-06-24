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
                inputArr = playString.split(" ");
                action = inputArr[0].toLowerCase();
                handIndex = parseInt(inputArr[1]);
                if (inputArr.length != 2) {
                    throw new Error(colors.red(("Invalid input. Please enter 'play (handIndex)' or 'discard (handIndex)'")));
                }

                if (action !== "play" && action !== "discard") {
                    throw new Error(colors.red(("Invalid action. Please enter 'play (handIndex)' or 'discard (handIndex)'")));
                }
               
                if (isNaN(handIndex) || handIndex < 0 || handIndex > 7) {
                    throw new Error(colors.red(("Invalid hand index. Please enter a number from 0 to 7 for handIndex.")));
                }
                playString = playString.toLowerCase();
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
                inputArr = drawString.split(" ");
                action = inputArr[0].toLowerCase();
                if (action != "draw" && action != "discard" || inputArr.length > 2) {
                  throw new Error(colors.red("Invalid input. Please enter 'draw' or 'discard (expedition)'."));
                }
                
                if (action == "draw") {
                    if (inputArr.length > 1) {
                        throw new Error(colors.red("Invalid input. Please enter only 'draw' for drawing from the deck."));
                      }
                }
                
                if (action == "discard") {
                    expedition = inputArr[1].toLowerCase();
                    const validExpeditions = ["red", "green", "white", "blue", "yellow"];
                  if (inputArr.length !== 2) {
                    throw new Error(colors.red("Invalid input. Please enter 'discard (expedition)'."));
                  }           
                  if (!validExpeditions.includes(expedition)) {
                    throw new Error(colors.red("Invalid expedition. Please enter one of the following colors: red, green, white, blue, yellow."));
                  }
                } 
                drawString = drawString.toLowerCase();
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
