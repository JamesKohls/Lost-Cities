const tf = require('@tensorflow/tfjs');
var colors = require('@colors/colors');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame } = require('./gameLogic.js');
const _ = require('lodash');

const learningRate = 0.001;
const discountFactor = 0.99;
const epsilonDecay = 0.9995;
const minEpsilon = 0.1;

class DQNAgent {
  constructor(inputSize, outputSize) {
    this.model = this.createModel(inputSize, outputSize);
    this.targetModel = this.createModel(inputSize, outputSize);
    this.updateTargetModel();
    this.memory = [];
    this.epsilon = 1.0;
    this.inputSize = inputSize;
    this.outputSize = outputSize;
  }

  createModel(inputSize, outputSize) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [inputSize] }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: outputSize, activation: 'linear' }));
    model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(learningRate) });
    return model;
  }
}

module.exports = DQNAgent;

function playReward(legalActions) {
  let reward = 0;
  // let action = legalActions.split(" ");
  // let index = parseInt(action[1]);
  // if (action[0] == "play" && !isNaN(index)) {}
  if (legalActions.length == 0) {
    return reward;
  }
  const input = legalActions[0];
  legalActions.shift(); // Remove the first element from the array

  try {
    game.play(gameObj, input);
    // If no error was thrown, increment the reward by 10
    reward += 10;
  } catch (error) {
    // If an error was thrown, decrement the reward by 10
    reward -= 10;
  }
  return reward;
}

function drawReward(legalActions) {
  let reward = 0;
  // let action = legalActions.split(" ");
  // let index = parseInt(action[1]);
  // if (action[0] == "play" && !isNaN(index)) {}
  if (legalActions.length == 0) {
    return reward;
  }
  const input = legalActions[0];
  legalActions.shift(); // Remove the first element from the array

  try {
    game.draw(gameObj, input);
    // If no error was thrown, increment the reward by 10
    reward += 10;
  } catch (error) {
    // If an error was thrown, decrement the reward by 10
    reward -= 10;
  }
  return reward;
}



module.exports.makeFirstDecision = function makeFirstDecision(gameObj) {
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

  const inputSize = inputData.length;
  const outputSize = 2;

  const model = createModel(inputSize, outputSize);
  const inputTensor = tf.tensor2d([inputData], [1, inputSize]);
  const preprocessedInputTensor = tf.div(tf.sub(inputTensor, 0.5), 0.5);
  const action = model.predict(preprocessedInputTensor).dataSync();
  const [playAction, discardAction] = action;
  
  let legalPlayActions = [];

  if (playAction > discardAction) {
    let minCardValue = Infinity;
    let mostCardsColor = null;

    // Find the card with the lowest value and the color with the most cards in hand
    aiHand.forEach((card, index) => {
      if (card.value < minCardValue) {
        minCardValue = card.value;
        mostCardsColor = card.color;
      }
    });

    // Play the card with the lowest value and the color with the most cards
    aiHand.forEach((card, index) => {
      if (card.value === minCardValue && card.color === mostCardsColor) {
        legalPlayActions.push(`play ${index}`);
      }
    });
  }

  if (discardAction > playAction) {
    let minCardValue = Infinity;
    let leastCardsColor = null;

    // Find the card with the lowest value and the color with the least cards in hand
    aiHand.forEach((card, index) => {
      if (card.value < minCardValue) {
        minCardValue = card.value;
        leastCardsColor = card.color;
      }
    });

    // Discard the card with the lowest value and the color with the least cards
    aiHand.forEach((card, index) => {
      if (card.value === minCardValue && card.color === leastCardsColor) {
        legalPlayActions.push(`discard ${index}`);
      }
    });
  }
  for (let i = 0; i < aiHand.length; i++) {
    if (playAction >= 0 && playAction <= 1) {
      legalPlayActions.push(`play ${i}`);
    }
  }

  return legalPlayActions;
};

module.exports.makeSecondDecision = function makeSecondDecision(gameObj) {
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

  const inputSize = inputData.length;
  const outputSize = 2;

  const model = createModel(inputSize, outputSize);
  const inputTensor = tf.tensor2d([inputData], [1, inputSize]);
  const preprocessedInputTensor = tf.div(tf.sub(inputTensor, 0.5), 0.5);
  const action = model.predict(preprocessedInputTensor).dataSync();
  const [drawAction, discardColorAction] = action;
  
  let legalActions = [];

  const colors = ['red', 'green', 'white', 'blue', 'yellow'];
  const discardPileLengths = colors.map(color => gameObj.discard[color].length);
  const isAllColorsEmpty = discardPileLengths.every(length => length == 0);

  if (isAllColorsEmpty || drawAction > discardColorAction) {
    legalActions.push('draw');
  }

  if (!isAllColorsEmpty && discardColorAction > drawAction) {
    const colors = ['red', 'green', 'white', 'blue', 'yellow'];
    legalActions.push(`discard ${colors[Math.floor(Math.random() * colors.length)]}`);
  }

  return legalActions;
};

