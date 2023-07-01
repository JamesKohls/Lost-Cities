// aiLogic.js
const tf = require('@tensorflow/tfjs');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame } = require('./gameLogic.js');

function createModel(inputSize, outputSize) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [inputSize] }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: outputSize, activation: 'linear' }));
  return model;
}

module.exports.makeDecision = function makeDecision(gameObj) {
  const deckSize = gameObj.deck.length;
  const aiHand = gameObj.player2.hand;
  const player1Expeditions = gameObj.player1.expeditions;
  const player2Expeditions = gameObj.player2.expeditions;
  const discardPile = gameObj.discard;

  const player1ExpeditionsFlat = [];
  for (const expedition of player1Expeditions) {
    if (expedition.length > 0) {
      for (const card of expedition) {
        player1ExpeditionsFlat.push({ color: card.color, value: card.value });
      }
    }
  }

  const player2ExpeditionsFlat = [];
  for (const expedition of player2Expeditions) {
    if (expedition.length > 0) {
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
  const outputSize = 4;

  const model = createModel(inputSize, outputSize);
  const inputTensor = tf.tensor2d([inputData], [1, inputSize]);
  const action = model.predict(inputTensor).dataSync();
  const [playAction, discardAction, drawAction, discardColorAction] = action;

  const legalActions = [];

  for (let i = 0; i < aiHand.length; i++) {
    if (playAction >= 0 && playAction <= 1) {
      legalActions.push(`play ${i}`);
    }
  }

  if (discardAction >= 0 && discardAction <= 1) {
    legalActions.push(`discard ${Math.floor(Math.random() * aiHand.length)}`);
  }

  if (drawAction >= 0 && drawAction <= 1) {
    legalActions.push('draw');
  }

  if (discardColorAction >= 0 && discardColorAction <= 1) {
    const colors = ['red', 'green', 'white', 'blue', 'yellow'];
    legalActions.push(`discard ${colors[Math.floor(Math.random() * colors.length)]}`);
  }

  const randomActions = [
    legalActions[Math.floor(Math.random() * legalActions.length)],
    legalActions[Math.floor(Math.random() * legalActions.length)],
  ];

  return randomActions;
};
