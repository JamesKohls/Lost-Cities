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
            height: 900,
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
            this.load.image('table', 'scenery/table2.png');
            this.load.image('expeditions', 'scenery/expeditions.png');
            this.load.image('back', 'scenery/back.png');
        }        

        function initGameLogic(){
            gameObj.deck = logic.shuffle(cardData)
            logic.deal(gameObj)
        }
    
        function create() {
            const background = this.add.image(0, 0, 'table').setOrigin(0, 0);
            const deckBack = this.add.image(0, this.game.scale.height / 2, 'back')
                .setScale(0.3)
                .setOrigin(-0.2, 0.5)
                .setInteractive(); // Ensure this line is there
            deckBack.on('pointerdown', () => {
                //console.log('Deck was clicked!');
                addDragCard(Math.floor(Math.random() * 1600),Math.floor(Math.random() * 900),'red2')
                    // You can add more actions or call other functions here.
            });
            //deckBack.setDepth(2); // or any value higher than all other depths

        
            const expeditionss = this.add.image(0, 0, 'expeditions').setOrigin(0, 0);
            expeditionss.setDepth(1);
            
            const addDragCard = (x, y, cardName) => {
                this.load.image(cardName, 'cards/' + cardName + '.png');
        
                this.load.once('complete', () => {
                    const card = this.physics.add.image(100, 450, cardName); // Card is defined here, after the image has loaded
        
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
        
                    this.tweens.add({
                        targets: card,
                        x: x,
                        y: y,
                        ease: 'Power1',
                        duration: 2000,
                        delay: 0,
                    });
                });
        
                this.load.start();
            };
            const addDeck = () => {
                cardFiles.forEach((cardFile) => {
                    const x = Math.floor(Math.random() * 1200) + 200;
                    const y = Math.floor(Math.random() * 600) + 200;
                    addDragCard(x, y, cardFile);
                });
            };
            const addHand = (hand) => {
                let handLength = hand.length
                let cardStep = 1100 / handLength
                let cardPos = 200
                console.log(handLength)
                hand.forEach((card) => {
                    let cardName = card.color + card.value
                    cardPos = cardPos + cardStep
                    //const x = Math.floor(Math.random() * 1200) + 200;
                    // const y = Math.floor(Math.random() * 600) + 200;
                    const y = 800;
                    addDragCard(cardPos, y, cardName);
                });
            };
        
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
