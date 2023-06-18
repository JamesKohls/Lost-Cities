// ui.test.js

const { printHand, printExpedtions, printMiddle } = require('../uiLogic.js');  

test('test expeditions', () => {
    let expeditions = {
        red: [
            {
                "color": "red",
                "value": 0
            },
            {
                "color": "red",
                "value": 2
            },
            {
                "color": "red",
                "value": 6
            },
            {
                "color": "red",
                "value": 9
            },
            {
                "color": "red",
                "value": 10
            },
        ],
        green: [

        ],
        white: [

        ],
        blue: [

        ],
        yellow: [

        ],
    }
    expect(printExpedtions(expeditions)).toEqual("  |0|            ");
})

