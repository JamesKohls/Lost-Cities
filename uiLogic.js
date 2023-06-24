// uiLogic.js

const chalk = require('chalk');
const Table = require('cli-table3');
var colors = require('@colors/colors');

// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.underline.red); // outputs red underlined text
// console.log('inverse the color'.inverse); // inverses the color
// console.log('OMG Rainbows!'.rainbow); // rainbow
// console.log('Run the trap'.trap); // Drops the bass


// let table = new Table({
//     head: [chalk.red('Red'), chalk.green('Green'), chalk.white('White'), chalk.blue('Blue'), chalk.yellow('Yellow')],
//     colWidths: [10, 10, 10, 10, 10] 
// });

// let data = {
//     red: ['0', '2', '4', '6', '8', '10', '', '', '', '', '', ''],
//     green: ['0', '', '', '', '', '', '', '', '', '', '', ''],
//     white: ['', '', '', '', '', '', '', '', '', '', '', ''],
//     blue: ['', '', '', '', '', '', '', '', '', '', '', ''],
//     yellow: ['', '', '', '', '', '', '', '', '', '', '', '']
// };

// table.push(
//     ['Red'].concat(data.red),
//     ['Green'].concat(data.green),
//     ['White'].concat(data.white),
//     ['Blue'].concat(data.blue),
//     ['Yellow'].concat(data.yellow)
// );

//console.log(table.toString());

function printCard(card) {
    let cardString = card.value.toString();
    cardString = colors[card.color](cardString);
    return cardString;
}



function printHand(hand){
    let table = new Table({ style: { head: [], border: [] } });

    handarr = []
    for (const card of hand){
        handarr.push(printCard(card))
    }

    table.push(
      [handarr[0], handarr[1], handarr[2], handarr[3], handarr[4], handarr[5], handarr[6], handarr[7]  ]
    );

    return table;
}

function printExpedtions(playerExp){
    let str = '  '
    for(let i = 0; i < 12; i++){
        
        if (playerExp.red[i]){
            str += printCard(playerExp.red[i])
        } else { str += '   ' }

        if (playerExp.green[i]){
            str += printCard(playerExp.green[i])
        } else { str += '   ' }

        if (playerExp.white[i]){
            str += printCard(playerExp.white[i])
        } else { str += '   ' }

        if (playerExp.blue[i]){
            str += printCard(playerExp.blue[i])
        } else { str += '   ' }

        if (playerExp.yellow[i]){
            str += printCard(playerExp.yellow[i])
        } else { str += '   ' }

        str += '\n';
    }
    return str;
}

function printDiscard(discard) {
    let str = '   '

    if (discard.red[0]){
        str += chalk.bold(printCard(discard.red[0]))
    } else { str += chalk.bold(chalk.red("| | "))}

    if (discard.green[0]){
        str += chalk.bold(printCard(discard.green[0]))
    } else { str += chalk.bold(chalk.green("| | "))}

    if (discard.white[0]){
        str += chalk.bold(printCard(discard.white[0]))
    } else { str += chalk.bold(chalk.white("| | "))}

    if (discard.blue[0]){
        str += chalk.bold(printCard(discard.blue[0]))
    } else { str += chalk.bold(chalk.blue("| | "))}

    if (discard.yellow[0]){
        str += chalk.bold(printCard(discard.yellow[0]))
    } else { str += chalk.bold(chalk.yellow("| | "))}

    return str;
}

// Determine the length of the longest expedition
function longestExpedition(player) {
    return Math.max(...Object.values(player.expeditions).map(arr => arr.length));
}

function printBoard(gameObj) {
    let table = new Table({ style: { head: [], border: [] } });
    
    let longestP1 = longestExpedition(gameObj.player1);
    let longestP2 = longestExpedition(gameObj.player2);

    // Create rows for player 2 expeditions
    for (let i = 0; i < longestP2; i++) {
        let rowP2 = ['red', 'green', 'white', 'blue', 'yellow'].map(color => gameObj.player2.expeditions[color][i] ? printCard(gameObj.player2.expeditions[color][i]) : '   ');
        table.push(rowP2);
    }

    // Create a row for the discard pile
    let rowDiscard = ['red', 'green', 'white', 'blue', 'yellow'].map(color => gameObj.discard[color][0] ? printCard(gameObj.discard[color][0]) : colors[color]('X'));
    table.push(rowDiscard);

    // Create rows for player 1 expeditions
    for (let i = 0; i < longestP1; i++) {
        let rowP1 = ['red', 'green', 'white', 'blue', 'yellow'].map(color => gameObj.player1.expeditions[color][i] ? printCard(gameObj.player1.expeditions[color][i]) : '   ');
        table.push(rowP1);
    }

    return table
}


module.exports = { printHand, printExpedtions, printDiscard, printBoard };  