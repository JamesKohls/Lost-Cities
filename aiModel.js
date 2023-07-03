// aiModel.js
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

  updateTargetModel() {
    this.targetModel.setWeights(this.model.getWeights);
  }

  selectAction(state) {
    if (Math.random() < this.epsilon) {
      // Exploration: choose a random action
      return Math.floor(Math.random() * this.outputSize);
    } 
    else {
      // Exploitation: choose the best action based on the current Q-values
      const qValues = this.predict(state);
      return tf.argMax(qValues).dataSync()[0];
    }
  }

  predict(state) {
    const inputTensor = tf.tensor2d([state], [1, this.inputSize]);
    const preprocessedInputTensor = tf.div(tf.sub(inputTensor, 0.5), 0.5);
    return this.model.predict(preprocessedInputTensor);
  }

}

module.exports = DQNAgent;