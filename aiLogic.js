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
  const outputSize = 4;

  const model = createModel(inputSize, outputSize);
  const inputTensor = tf.tensor2d([inputData], [1, inputSize]);
  const preprocessedInputTensor = tf.div(tf.sub(inputTensor, 0.5), 0.5);
  const action = model.predict(preprocessedInputTensor).dataSync();
  const [playAction, discardAction, drawAction, discardColorAction] = action;
  console.log(action);
  
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

  const randomPlayAction = legalActions.find(action => action.startsWith('play'));
  const randomDiscardAction = legalActions.find(action => action.startsWith('discard'));

  const randomActions = [randomPlayAction, randomDiscardAction];

  return randomActions;
};

