// gameLogic.js

// Fisher-Yates Shuffle
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function deal(deck){
    let dealAmount = 8
    let user1 = []
    let user2 = []
    while (dealAmount > 0){
        user1.push(deck.shift())
        user2.push(deck.shift())
        dealAmount-- 
    }
    return [deck, user1, user2]
}

module.exports = { shuffle, deal };  