// uiLogic.js

const chalk = require('chalk');

function printCard(card) {
    let cardString = "";
    switch(card.color) {
        case "red":
            cardString += chalk.red("|" + card.value + "|");
            break;
        case "green":
            cardString += chalk.green("|" + card.value + "|");
            break;
        case "white":
            cardString += chalk.white("|" + card.value + "|");
            break;
        case "blue":
            cardString += chalk.blue("|" + card.value + "|");
            break;
        case "yellow":
            cardString += chalk.yellow("|" + card.value + "|");
            break;
    }
    return cardString;
}

function printHand(hand){
    let handString = "";
    for (const card of hand){
        handString += printCard(card)
        handString += ' '
    }
    return handString;
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


module.exports = { printHand, printExpedtions, printDiscard };  