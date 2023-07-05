// aiLogic.js
const tf = require('@tensorflow/tfjs');
var colors = require('@colors/colors');
const game = require('./gameLogic.js');
const _ = require('lodash');
const DQNAgent = require('./aiModel.js');

function makeFirstDecision(gameObj) {
  const state1 = getState(gameObj);
  const inputSize = getInputSize(gameObj);
  const outputSize = 8;
  const agent1 = new DQNAgent(inputSize, outputSize);
  const action1 = agent1.selectAction(state1);
  const predict1 = agent1.predict(state1);
  const qValues1 = predict1.dataSync();
  const qValue1 = qValues1[action1];
  const playString = getPlayString(qValue1, action1);
  // return {action1, qValues1, qValue1, playString};
  return playString;
};

function makeSecondDecision(gameObj) {
  const state2 = getState(gameObj);
  const inputSize = getInputSize(gameObj);
  const outputSize = 6;
  const agent2 = new DQNAgent(inputSize, outputSize);
  const action2 = agent2.selectAction(state2);
  const predict2 = agent2.predict(state2);
  const qValues2 = predict2.dataSync();
  const qValue2 = qValues2[action2];
  const drawString = getDrawString(gameObj, qValue2);
  // return {action2, qValues2, drawString};
  return drawString;
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

function getPlayString(qValue, index) {
  if (qValue >= 0) {
    const playString = "play " + index.toString();
    return playString;
  }
  else {
    const playString = "discard " + index.toString();
    return playString;
  }
}

function calculateReward(gameObj, playAction, drawAction) {
  // Check if the action is valid
  try {
    game.play(gameObj, playAction); // Attempt to play the action
    game.draw(gameObj, drawAction);
    // Action is valid, provide a positive reward
    return 1.0;
  } catch (error) {
    // Action is invalid, provide a negative reward
    return -1.0;
  }
}

function getDrawString(gameObj, qValue) {
  const colors = ['red', 'green', 'white', 'blue', 'yellow'];
  const discardPileLengths = colors.map(color => gameObj.discard[color].length);
  const isAllColorsEmpty = discardPileLengths.every(length => length == 0);
  if (isAllColorsEmpty || qValue < 0) {
    const drawString = "draw"
    return drawString
  }
  else {
    const colors = ['red', 'green', 'white', 'blue', 'yellow'];
    const drawString = "discard " + colors[Math.floor(Math.random() * colors.length)];
    return drawString;
  }

}

// Export the getState function
module.exports = { getState, calculateReward, makeFirstDecision, makeSecondDecision, getInputSize, getState };