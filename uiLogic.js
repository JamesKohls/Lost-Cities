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

function printMiddle(middle) {
    let str = '   '

    if (middle.red[0]){
        str += chalk.bold(printCard(middle.red[0]))
    } else { str += chalk.bold(chalk.red("| | "))}

    if (middle.green[0]){
        str += chalk.bold(printCard(middle.green[0]))
    } else { str += chalk.bold(chalk.green("| | "))}

    if (middle.white[0]){
        str += chalk.bold(printCard(middle.white[0]))
    } else { str += chalk.bold(chalk.white("| | "))}

    if (middle.blue[0]){
        str += chalk.bold(printCard(middle.blue[0]))
    } else { str += chalk.bold(chalk.blue("| | "))}

    if (middle.yellow[0]){
        str += chalk.bold(printCard(middle.yellow[0]))
    } else { str += chalk.bold(chalk.yellow("| | "))}

    return str;
}


module.exports = { printHand, printExpedtions, printMiddle };  