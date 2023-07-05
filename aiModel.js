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
    const sourceWeights = this.model.getWeights();
    const targetWeights = this.targetModel.getWeights();
    for (let i = 0; i < sourceWeights.length; i++) {
      targetWeights[i].assign(sourceWeights[i]);
    }
    this.targetModel.setWeights(targetWeights);
  }

  // Epsilon-greedy exploration
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

  memorize(state, action, reward, nextState, done) {
    this.memory.push({ state, action, reward, nextState, done });
    if (this.memory.length > 50000) {
      this.memory.shift();
    }
  }

  experienceReplay() {
    if (this.memory.length < 32) {
      return;
    }
    const miniBatch = _.sampleSize(this.memory, 32);
    const states = [];
    const targets = [];
    for (const sample of miniBatch) {
      const { state, action, reward, nextState, done } = sample;
      const target = this.targetModel.predict(tf.tensor2d([state], [1, this.inputSize])).dataSync();
      if (done) {
        target[action] = reward;
      } else {
        const nextQValues = this.targetModel.predict(tf.tensor2d([nextState], [1, this.inputSize])).dataSync();
        target[action] = reward + discountFactor * _.max(nextQValues);
      }
      states.push(state);
      targets.push(target);
    }
    const x = tf.tensor2d(states, [states.length, this.inputSize]);
    const y = tf.tensor2d(targets, [targets.length, this.outputSize]);
    this.model.fit(x, y, { batchSize: 32, epochs: 1 });
  }

  updateEpsilon() {
    if (this.epsilon > minEpsilon) {
      this.epsilon *= epsilonDecay;
    }
  }

}

module.exports = DQNAgent;