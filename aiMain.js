// main.js
const game = require('./gameLogic.js');
const ai = require('./aiLogic.js')
const ui = require('./uiLogic.js');
const readline = require('readline');
let deck = require('./cards.json');
const Table = require('cli-table3');
var colors = require('@colors/colors');
const DQNAgent = require('./aiModel.js');

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
    let totalScores = { player1: 0, player2: 0 };
    let gameState;

    for (let gameCount = 1; gameCount <= 1; gameCount++) {
        console.log(`Game ${gameCount}:`);
        // shuffe deck
        gameState = game.createGamestate()
        gameState.deck = game.shuffle(deck)
        // assign name(s)
        let p1 = await readLineAsync('Please enter your name (default player1): ');
        p1 = p1 || 'Player1'; // If the user doesn't provide a name, use 'Player1' by default
        gameState.player1.name = p1
        console.log(`Welcome, ${p1}!`);

        gameState.player2.name = "AI";


        // deal the cards
        game.deal(gameState)

        const agent1 = new DQNAgent(ai.getInputSize(gameState), 8);
        const agent2 = new DQNAgent(ai.getInputSize(gameState), 6);

        while (!game.endgame(gameState)) {
            //console.log(ui.printDiscard(gameState.discard))
            //console.log(ui.printBoard(gameState).toString())
            console.log(`\n-------------------------- ${gameState[gameState.turn].name}'s TURN-------------------------- \n`)

            console.log("DISCARD")
            console.log(gameState.discard, "\n")
            console.log(`${gameState[gameState.turn].name}'s EXPEDITIONS`)
            console.log(gameState[gameState.turn].expeditions, "\n")
            console.log("HAND")
            console.log(ui.printHand(gameState[gameState.turn].hand).toString(), "\n");
            console.log("Deck Size: ", gameState.deck.length);
            // Ask the user to play/discard a card from hand
            while (!game.endgame(gameState)) {
                if (gameState[gameState.turn].name == p1) {
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

                else if (gameState[gameState.turn].name == "AI") {
                    let curState = ai.getState(gameState);
                    let playString = ai.makeFirstDecision(gameState);
                    console.log(playString);
                    try {             
                        let reward = ai.playReward(gameState, playString);
                        game.play(gameState, playString);
                        let nextState = ai.getState(gameState);
                        let done = game.endgame(gameState);
                        console.log(reward);
                        agent1.memorize(curState, playString, reward, nextState, done);
                        agent1.experienceReplay();
                        agent1.updateEpsilon();
                        break;
                    }
                    catch (error) {
                        console.log(colors.red(error.message));
                    }
                }

            }

            // Ask the user to draw a card from the deck or from the expedition

            while (!game.endgame(gameState)) {
                if (gameState[gameState.turn].name == p1) {
                    console.log("input: draw OR discard (expedition), enter: draw");
                    let drawString = await readLineAsync("");
                    if (drawString == '') {
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

                else if (gameState[gameState.turn].name == "AI") {
                    let curState = ai.getState(gameState);
                    let drawString = ai.makeSecondDecision(gameState);
                    console.log(drawString);
                    try {
                        let reward = ai.drawReward(gameState, drawString);
                        game.draw(gameState, drawString);
                        let nextState = ai.getState(gameState);
                        let done = game.endgame(gameState);
                        console.log(reward);
                        agent2.memorize(curState, drawString, reward, nextState, done);
                        agent2.experienceReplay();
                        agent2.updateEpsilon();
                        break;
                    }
                    catch (error) {
                        console.log(colors.red(error.message));
                    }
                }
            }
            
            // go next
            game.turn(gameState)


        }

        totalScores.player1 += game.score(gameState).player1;
        totalScores.player2 += game.score(gameState).player2;
        console.log(`Total scores after Game ${gameCount}:`);
        console.log(`${gameState.player1.name}: ${totalScores.player1}`);
        console.log(`${gameState.player2.name}: ${totalScores.player2}`);
        break;

    }

    if (totalScores.player1 > totalScores.player2) {
        console.log(`\n${gameState.player1.name} wins! Congratulations!`);
    }
    else if (totalScores.player1 < totalScores.player2) {
        console.log(`\n${gameState.player2.name} wins! Congratulations!`);
    }
    else {
        console.log(`\nIt's a tie! Both players have the same combined score.`);
    }
};

startApp().catch(console.error);

