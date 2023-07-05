# Lost Cities

Lost Cities is a Javascript recreation of the popular card game "Lost Cities"

## Installation

1. Pull or download this repo
2. ensure node is installed
3. add the following packages (for console interaction)
- "@colors/colors": "^1.5.0",
- "@tensorflow/tfjs": "^4.8.0",
- "cli-table3": "^0.6.3"
  

## Usage

Interacting with logic components

- PvP through console: node main.js
- PvAi through console: node aiMain.js
- testing: npm test

Interacting with UI components

- cd lost-cities-react
- npm start

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## To-Do Lists
1. AIModel
    - Initialize game state, updates it after every single move/action (both players)
    - Initialize Q value, updates it after every single move/action (AI only)
    - Come up with all possible states that AI may encounter
    - Create a reward function (Positive rewards for favorable moves or winning the game and vice versa; rewards value can be the same for all favorable moves and vice versa)
    - Create an action selection function (determined by the highest Q value in the Q table)
    - Constructa neural network 
        - First layer/ Input layer: Uses for state obervations
        - Second Layer and Third Layer: Based on the policy and Training Loop
        - Fourth Layer / Output Layer: Q values table
2. Convert actions into valid strings based on the Q values and action index
3. Make sure reward function only return positive rewards for favorable moves and vice versa
    - Bug: Cause the game call play/draw function twice there will be an extra card missing after each turn
4. Perhaps train the AI before the game
