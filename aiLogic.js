// aiLogic.js
const tf = require('@tensorflow/tfjs');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame} = require('../gameLogic.js'); 

function createModel(inputSize, outputSize) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [inputSize] }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: outputSize, activation: 'linear' }));
    return model;
}

function makeDecision(gameObj) {
    let deckSize = gameObj.deck.length;
    let aiHand = gameObj.player2.hand;
    const player1Expeditions = gameObj.player1.expeditions;
    const player2Expeditions = gameObj.player2.expeditions;
    const discardPile = gameObj.discard; 

    const inputData = [deckSize, aiHand, player1Expeditions, player2Expeditions, discardPile];
    const inputSize = deckSize + aiHand.length + player1Expeditions.length + player2Expeditions.length + discardPile.length;
    const outputSize = 2;

    const model = createModel(inputSize, outputSize);
    const action = model.predict(inputData);
    return action;
}