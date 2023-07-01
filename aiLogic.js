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
        legalActions.push(`play ${index}`);
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
        legalActions.push(`discard ${index}`);
      }
    });
  }
  for (let i = 0; i < aiHand.length; i++) {
    if (playAction >= 0 && playAction <= 1) {
      legalActions.push(`play ${i}`);
    }
  }

  return legalActions;
};

