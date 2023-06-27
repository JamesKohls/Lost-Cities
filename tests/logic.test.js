// logic.test.js

let cards = require('../cards.json');
const { createGamestate, shuffle, deal, play, draw, turn, score, endgame} = require('../gameLogic.js');  

function unshuffledGameInit(){
    let game = createGamestate()
    game.deck = [...cards]  // Creates a copy of cardDeck
    deal(game)
    return game
    // - What the hands looks like in unshuffled Input
    //-P1- -P2- 
    // R0   R0
    // R0   R2
    // R3   R4
    // R5   R6
    // R7   R8
    // R9   R10
    // G0   G0
    // G0   G2
}

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
    let game = unshuffledGameInit()
    expect(game.deck.length).toEqual(44);
    expect(game.player1.hand.length).toEqual(8);
    expect(game.player2.hand.length).toEqual(8);

    expect(game.player1.hand[0]).toEqual({"color": "red", "value": 0});
    expect(game.player1.hand[3]).toEqual({"color": "red", "value": 5});
    expect(game.player1.hand[7]).toEqual({"color": "green", "value": 0});

    expect(game.player2.hand[0]).toEqual({"color": "red", "value": 0});
    expect(game.player2.hand[3]).toEqual({"color": "red", "value": 6});
    expect(game.player2.hand[7]).toEqual({"color": "green", "value": 2});
})

test('places a valid card in expedition', () => { 
    let game = unshuffledGameInit()
    play(game, "play 0");
    expect(game.player1.expeditions.red).toEqual([{ color: 'red', value: 0 }]);
})

test('places valid cards in expeditions', () => { 
    let game = unshuffledGameInit()
    for(let i =0; i<24; i++){
        play(game, "play 0");
        draw(game, "draw");
        game.turn = "player1"
    }
    expect(game.player1.expeditions.red.length).toEqual(6);
    expect(game.player1.expeditions.green.length).toEqual(10);
    expect(game.player1.expeditions.white.length).toEqual(8);
})

test('places a valid card in discard', () => { 
    let game = unshuffledGameInit()
    play(game, "discard 0");
    expect(game.discard.red).toEqual([{ color: 'red', value: 0 }]);
})

test('takes a card from discard', () => { 
    let game = unshuffledGameInit()
    game.discard.yellow.push({"color": "yellow", "value": 5})
    play(game, "play 0");
    draw(game, "discard yellow")
    expect(game.player1.hand).toContainEqual({ color: 'yellow', value: 5 });
})

test('places a card in the wrong order', () => { 
    let game = unshuffledGameInit();
    play(game, "play 3");
    play(game, "play 3");
    play(game, "play 3");
    expect(() => {
        play(game, "play 0");
    }).toThrow('Invalid Move: cannot place card of lower value');
});

test('places a card in the wrong order', () => { 
    let game = unshuffledGameInit();
    play(game, "play 0");
    play(game, "play 0");
    play(game, "play 1");
    play(game, "play 1");
    //expect(game.player1.hand.length).toEqual(8);
    expect(() => {
        play(game, "play 0");
    }).toThrow('Invalid Move: cannot place card of lower value');
});

test('ensure hand is refilled on bad input', () => { 
    let game = unshuffledGameInit();
    play(game, "play 4");
    draw(game, "draw")
    expect(game.player1.hand.length).toEqual(8);
    expect(() => {
        play(game, "play 3");
    }).toThrow('Invalid Move: cannot place card of lower value');
    play(game, "play 4");
    expect(game.player1.hand.length).toEqual(7);
    draw(game, "draw")
    expect(game.player1.hand.length).toEqual(8);
});

test('take a card from empty discard', () => { 
    let game = unshuffledGameInit();
    play(game, "play 0");
    expect(() => {
        draw(game, "discard red")
    }).toThrow('Invalid Move: pile is empty');
});

test('next turn', () => { 
    let game = unshuffledGameInit();
    play(game, "play 0");
    turn(game)
    play(game, "play 0");
    expect(game.player1.expeditions.red.length).toEqual(1);
    expect(game.player1.expeditions.red.length).toEqual(1);
});

test('calculates score for expeditions with no cards', () => {
    let game = unshuffledGameInit();

    expect(score(game)).toEqual({
        player1: 0,
        player2: 0
    });
});

test('calculates score for expeditions with only wager cards', () => {
    let game = unshuffledGameInit();
    game.player1.expeditions.red = [{ color: 'red', value: 0 },];
    game.player1.expeditions.white = [{ color: 'white', value: 0 },];
    game.player1.expeditions.blue = [{ color: 'blue', value: 0 },];

    game.player2.expeditions.red = [{ color: 'greem', value: 0 },];
    game.player2.expeditions.white = [{ color: 'yellow', value: 0 },];

    expect(score(game)).toEqual({
        player1: -120,
        player2: -80
    });
  });

test('calculates score for expeditions with wager cards (Only player1 has cards)', () => {
    let game = unshuffledGameInit();
    game.player1.expeditions.red = [
        { color: 'red', value: 0 }, { color: 'red', value: 2 }, { color: 'red', value: 5 }, { color: 'red', value: 7 },];
    game.player1.expeditions.white = [{ color: 'white', value: 10},];
    game.player1.expeditions.blue = [{ color: 'blue', value: 5 },];

    expect(score(game)).toEqual({
        player1: -37,
        player2: 0
    });
});

test('calculates score for expeditions with wager cards (Both Players have cards)', () => {
    let game = unshuffledGameInit();

    // player 1
    game.player1.expeditions.red = [
        { color: 'red', value: 0 }, { color: 'red', value: 2 }, { color: 'red', value: 5 }, { color: 'red', value: 7 },];
    game.player1.expeditions.white = [{ color: 'white', value: 10},];
    game.player1.expeditions.blue = [{ color: 'blue', value: 5 },];

    // player 2
    game.player2.expeditions.red = [
        { color: 'red', value: 0 }, { color: 'red', value: 3 }, { color: 'red', value: 7 }, { color: 'red', value: 10 },];
    game.player2.expeditions.white = [{ color: 'white', value: 0 }, { color: 'white', value: 10},];
    game.player2.expeditions.blue = [{ color: 'green', value: 7 },];

    expect(score(game)).toEqual({
        player1: -37,
        player2: -33
    });
});

test('checks if game ends when no cards left in the deck', () => {
    let game = unshuffledGameInit();
    expect(endgame(game)).toBe(false);
  
    // Simulate emptying the deck
    game.deck = [];
    expect(endgame(game)).toBe(true);
});

test('Should print out the victory message when game ends', () => {
    let game = unshuffledGameInit();
    game.deck = [];
    let player1Score = 100;
    let player2Score = 0;
    game.player1.name = 'Player 1';
    game.player2.name = 'Player 2';
    console.log = jest.fn();

    if (endgame(game)) {
      if (player1Score > player2Score) {
        console.log(`\n${game.player1.name} wins! Congratulations!`);
      } 
      else if (player2Score > player1Score) {
        console.log(`\n${game.player2.name} wins! Congratulations!`);
      } 
      else {
        console.log("\nIt's a tie! The game ends in a draw.");
      }
    }
  
    expect(console.log).toHaveBeenCalledWith(`\n${game.player1.name} wins! Congratulations!`);
  });
  