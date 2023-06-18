// uiLogic.js

const chalk = require('chalk');

// console.log(chalk.green('This is a message in green'));
// console.log(chalk.red('This is a message in red'));

function displayHand(hand){
    for (const card of hand){
        handString = ""
        switch(card.color) {
            case "red":
                console.log(chalk.red("[" + card.value + "]"))
                break;
            case "green":
                console.log(chalk.green("[" + card.value + "]"))
                break;
            case "white":
                console.log(chalk.white("[" + card.value + "]"))
                break;
            case "blue":
                console.log(chalk.blue("[" + card.value + "]"))
                break;
            case "yellow":
                console.log(chalk.yellow("[" + card.value + "]"))
                break;
        }
    }
}

module.exports = { displayHand };  