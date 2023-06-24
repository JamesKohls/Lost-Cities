// logic.test.js

const { createGamestate, shuffle, deal } = require('../gameLogic.js');  

test('shuffles fifteen items', () => {
    let deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    let shuffledDeck = [...deck]; // make a copy of the deck
    shuffle(shuffledDeck);
    
    // Check that not every card is in its original position
    let samePositionCount = 0;
    for (let i = 0; i < deck.length; i++) {
        if (deck[i] === shuffledDeck[i]) {
            samePositionCount++;
        }
    }
    
    expect(samePositionCount).toBeLessThan(deck.length);
});

test('deals cards from a deck', () => {
    let game = createGamestate()
    game.deck = [
        {
            "color": "red",
            "value": 1
        },
        {
            "color": "red",
            "value": 2
        },
        {
            "color": "red",
            "value": 3
        },
        {
            "color": "red",
            "value": 4
        },
        {
            "color": "red",
            "value": 5
        },
        {
            "color": "red",
            "value": 6
        },
        {
            "color": "red",
            "value": 7
        },
        {
            "color": "red",
            "value": 8
        },
        {
            "color": "red",
            "value": 9
        },
        {
            "color": "red",
            "value": 10
        },
        {
            "color": "red",
            "value": 11
        },
        {
            "color": "red",
            "value": 12
        },
        {
            "color": "red",
            "value": 13
        },
        {
            "color": "red",
            "value": 14
        },
        {
            "color": "red",
            "value": 15
        },
        {
            "color": "red",
            "value": 16
        },
    ]
    deal(game)

    expect(game.deck).toEqual([]);
    expect(game.player1.hand).toEqual([
        {
            "color": "red",
            "value": 1
        },
        {
            "color": "red",
            "value": 3
        },
        {
            "color": "red",
            "value": 5
        },
        {
            "color": "red",
            "value": 7
        },
        {
            "color": "red",
            "value": 9
        },
        {
            "color": "red",
            "value": 11
        },
        {
            "color": "red",
            "value": 13
        },
        {
            "color": "red",
            "value": 15
        },
    ]);
    expect(game.player2.hand).toEqual([
        {
            "color": "red",
            "value": 2
        },
        {
            "color": "red",
            "value": 4
        },
        {
            "color": "red",
            "value": 6
        },
        {
            "color": "red",
            "value": 8
        },
        {
            "color": "red",
            "value": 10
        },
        {
            "color": "red",
            "value": 12
        },
        {
            "color": "red",
            "value": 14
        },
        {
            "color": "red",
            "value": 16
        },
    ]);
})

// test('places a card', () => { 
//     let game = createGamestate()
//     game.deal(gameState)
//     game.play(game, "play 0 0");

// })