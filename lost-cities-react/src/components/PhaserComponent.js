import { useEffect } from 'react';
import Phaser from 'phaser';

const logic = require('../logic/gameLogic.js');
const cardData = require('../logic/cards.json');

const PhaserComponent = () => {
    useEffect(() => {
        let game;
        let gameObj = logic.createGamestate()
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: 1600,
            height: 1000,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            },
            scene: {
                preload: preload,
                init: initGameLogic,
                create: create,
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            backgroundColor: '#f0f0f0', // white background
        };
        game = new Phaser.Game(config);


        let cardFiles = [
            'blue0', 'blue2', 'blue3', 'blue4', 'blue5', 'blue6', 'blue7', 'blue8', 'blue9', 'blue10',
            'green0', 'green2', 'green3', 'green4', 'green5', 'green6', 'green7', 'green8', 'green9', 'green10',
            'red0', 'red2', 'red3', 'red4', 'red5', 'red6', 'red7', 'red8', 'red9', 'red10',
            'white0', 'white2', 'white3', 'white4', 'white5', 'white6', 'white7', 'white8', 'white9', 'white10',
            'yellow0', 'yellow2', 'yellow3', 'yellow4', 'yellow5', 'yellow6', 'yellow7', 'yellow8', 'yellow9', 'yellow10',
        ];

        function preload() {
            cardFiles.forEach((card) => {
                this.load.image(card, 'cards/' + card + '.png');
            });
        }        

        function initGameLogic(){
            gameObj.deck = logic.shuffle(cardData)
            logic.deal(gameObj)
        }
    
        function create() {
            const addDragCard = (x, y, cardName) => {
                const card = this.physics.add.image(x, y, cardName);
                card.setCollideWorldBounds(true);
        
                let scaleX = this.game.scale.width / card.width / 6;
                let scaleY = this.game.scale.height / card.height / 6;
                let scale = Math.min(scaleX, scaleY);
                card.setScale(scale);
        
                card.setInteractive({ draggable: true });
        
                card.on('dragstart', function (pointer) {
                    this.setDepth(1);
                });
        
                card.on('drag', function (pointer, dragX, dragY) {
                    this.x = dragX;
                    this.y = dragY;
                });
        
                card.on('dragend', function (pointer) {
                    this.setDepth(0);
                });
            };
            const addDeck = () => {
                cardFiles.forEach((cardFile) => {
                    const x = Math.floor(Math.random() * 1600) + 1;
                    const y = Math.floor(Math.random() * 1000) + 1;
                    addDragCard(x, y, cardFile);
                });
            };
            const addHand = (hand) => {
                //console.log(hand)
                hand.forEach((card) => {
                    let cardName = card.color + card.value
                    const x = Math.floor(Math.random() * 1600) + 1;
                    const y = Math.floor(Math.random() * 1000) + 1;
                    addDragCard(x, y, cardName);
                });
            };
        
            //console.log(gameObj)
            addHand(gameObj.player1.hand)
        }
        

        // Function to handle window resize
        function resize() {
            game.scale.refresh();
        }
    
        // Add event listeners
        window.addEventListener('resize', resize);
        window.addEventListener('fullscreenchange', resize);
        window.addEventListener('mozfullscreenchange', resize); // Firefox
        window.addEventListener('webkitfullscreenchange', resize); // Chrome, Safari and Opera
        window.addEventListener('msfullscreenchange', resize); // IE
    
        // Remove event listeners when the component is unmounted
        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('fullscreenchange', resize);
            window.removeEventListener('mozfullscreenchange', resize);
            window.removeEventListener('webkitfullscreenchange', resize);
            window.removeEventListener('msfullscreenchange', resize);
        };
    }, []);    
};

export default PhaserComponent;
