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
  const aiHand = _.cloneDeep(gameObj[gameObj.turn].hand);
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

function getDrawString(gameObj, qValue) {
  const colors = ['red', 'green', 'white', 'blue', 'yellow'];
  const discardPileLengths = colors.map(color => gameObj.discard[color].length);
  const isAllColorsEmpty = discardPileLengths.every(length => length == 0);
  let drawString;
  if (isAllColorsEmpty || qValue < 0) {
    drawString = "draw"
    return drawString
  }
  else {
    const nonEmptyColors = colors.filter((_, index) => discardPileLengths[index] > 0);
    const randomColor = nonEmptyColors[Math.floor(Math.random() * nonEmptyColors.length)];
    drawString = "discard " + randomColor;
    return drawString;
  }
}

function atempPlay(gameObj, playString) {
  let reward;
  let inputArr = playString.split(" ");
  if (inputArr.length !== 2) {
      throw new Error(colors.red("Invalid input. Please enter 'play (handIndex)' or 'discard (handIndex)'"));
    }
  else {
      action = inputArr[0].toLowerCase();
      handIndex = parseInt(inputArr[1]);
  
      if (action !== "play" && action !== "discard") {
          throw new Error(colors.red("Invalid action. Please enter 'play (handIndex)' or 'discard (handIndex)'"));
      }       
  
      else if (isNaN(handIndex) || handIndex < 0 || handIndex > 7) {
          throw new Error(colors.red("Invalid hand index. Please enter a number from 0 to 7 for handIndex."));
      }
      else {
          let selectedCard = gameObj[gameObj.turn].hand.splice(handIndex, 1)[0];
          let deckLength = gameObj[gameObj.turn].expeditions[selectedCard.color].length;
      
          if (action == 'play') {
              let curVal = gameObj[gameObj.turn].expeditions[selectedCard.color][deckLength-1]
              if (curVal) {
                  if (curVal.value > selectedCard.value) {
                      gameObj[gameObj.turn].hand.splice(handIndex, 0, selectedCard); // put selected card back
                      throw new Error(colors.red("Invalid Move: cannot place card of lower value"));
                  }
              }
              gameObj[gameObj.turn].hand.splice(handIndex, 0, selectedCard); // put selected card back
              reward = 10;
              return reward;        
          } 
          else if (action == 'discard') {
            gameObj[gameObj.turn].hand.splice(handIndex, 0, selectedCard); // put selected card back
            reward = 10;
            return reward; 
          } 
      }
  } 
}

function atempDraw(gameObj, drawString){
  let reward;
  let inputArr = drawString.split(" ");
  action = inputArr[0].toLowerCase();
  if (action != "draw" && action != "discard" || inputArr.length > 2) {
      throw new Error(colors.red("Invalid input. Please enter 'draw' or 'discard (expedition)'."));
  }
              
  if (action == "draw") {
      if (inputArr.length > 1) {
          throw new Error(colors.red("Invalid input. Please enter only 'draw' for drawing from the deck."));
      }
      else {
        reward = 10;
        return reward;
      }
  }
  if (action == "discard") {
      expedition = inputArr[1].toLowerCase();
      const validExpeditions = ["red", "green", "white", "blue", "yellow"];
      if (inputArr.length !== 2) {
          throw new Error(colors.red("Invalid input. Please enter 'discard (expedition)'."));
      }           
      else if (!validExpeditions.includes(expedition)) {
          throw new Error(colors.red("Invalid expedition. Please enter one of the following colors: red, green, white, blue, yellow."));
      }
      else {
          if (gameObj.discard[expedition].length > 0){
              reward = 10;
              return reward;
          } 
          else {
              throw new Error(colors.red("Invalid Move: pile is empty"));
          }

      }
  }  
}

function playReward(gameObj, playAction) {
  // Check if the action is valid
  try {
    reward = atempPlay(gameObj, playAction); // Attempt to play the action
    // Action is valid, provide a positive reward
    return reward;
  } 
  catch (error) {
    // Action is invalid, provide a negative reward
    return -10;
  }
}

function drawReward(gameObj, drawAction) {
  // Check if the action is valid
  try {
    reward = atempDraw(gameObj, drawAction); // Attempt to play the action
    // Action is valid, provide a positive reward
    return reward;
  } 
  catch (error) {
    // Action is invalid, provide a negative reward
    return -10;
  }
}

// Export the getState function
module.exports = { getState, playReward, drawReward, makeFirstDecision, makeSecondDecision, getInputSize, getDrawString, getPlayString };