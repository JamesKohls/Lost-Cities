// logic.test.js

const { shuffle, deal } = require('../gameLogic.js');  

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
    let deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    let output = deal(deck)

    expect(output[0]).toEqual([]);
    expect(output[1]).toEqual([1,3,5,7,9,11,13,15]);
    expect(output[2]).toEqual([2,4,6,8,10,12,14,16]);
})