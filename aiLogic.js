// aiLogic.js
const tf = require('@tensorflow/tfjs');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame} = require('../gameLogic.js'); 

function makeDecision(gameObj) {
    let deckSize = gameObj.deck.length;
    let aiHand = gameObj.player2.hand;
    const player1Expeditions = gameObj.player1.expeditions;
    const player2Expeditions = gameObj.player2.expeditions;
    const discardPile = gameObj.discard; 
}