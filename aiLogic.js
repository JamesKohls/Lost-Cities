// aiLogic.js
const tf = require('@tensorflow/tfjs');
var colors = require('@colors/colors');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame } = require('./gameLogic.js');
const _ = require('lodash');
const DQNAgent = require('./aiModel.js');

module.exports.makeFirstDecision = function makeFirstDecision(gameObj) {
  const state1 = getState(gameObj);
  const inputSize = getInputSize(gameObj);
  const outputSize = 8;
  const agent1 = new DQNAgent(inputSize, outputSize);
  const action1 = agent1.selectAction(state1);
  const predict1 = agent1.predict(state1);
  const qValues1 = predict1.dataSync();
  return {action1, qValues1};
};

module.exports.makeSecondDecision = function makeSecondDecision(gameObj) {
  const state2 = getState(gameObj);
  const inputSize = getInputSize(gameObj);
  const outputSize = 2;
  const agent2 = new DQNAgent(inputSize, outputSize);
  const action2 = agent2.selectAction(state2);
  const predict2 = agent2.predict(state2);
  const qValues2 = predict2.dataSync();
  return {action2, qValues2};
};

function getState(gameObj) {
  const deckSize = gameObj.deck.length;
  const aiHand = gameObj.player2.hand;
  const player1Expeditions = gameObj.player1.expeditions;
  const player2Expeditions = gameObj.player2.expeditions;
  const discardPile = Object.values(gameObj.discard).flat();
  const player1ExpeditionsFlat = [];

  for (const color in player1Expeditions) {
    if (player1Expeditions.hasOwnProperty(color)) {
      const expedition = player1Expeditions[color];
      for (const card of expedition) {
        player1ExpeditionsFlat.push({ color: card.color, value: card.value });
      }
    }
  }
  
  const player2ExpeditionsFlat = [];
  for (const color in player2Expeditions) {
    if (player2Expeditions.hasOwnProperty(color)) {
      const expedition = player2Expeditions[color];
      for (const card of expedition) {
        player2ExpeditionsFlat.push({ color: card.color, value: card.value });
      }
    }
  }

  const inputData = [
    deckSize,
    ...aiHand,
    ...player1ExpeditionsFlat,
    ...player2ExpeditionsFlat,
    ...discardPile,
  ];

  return inputData;

}

function getInputSize(gameObj) {
  const inputData = getState(gameObj);
  const inputSize = inputData.length;

  return inputSize;
}

function getPlayString(index) {
  const playString = index;

  return playString;
}

function getDrawString(index) {
  const drawString = index;

  return drawString;
}