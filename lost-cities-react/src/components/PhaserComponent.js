import { useEffect } from 'react';
import Phaser from 'phaser';
const logic = require('../logic/gameLogic.js');

const PhaserComponent = () => {
    useEffect(() => {
        let game;
        let gameState = logic.createGamestate()
        console.log(gameState)
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            },
            scene: {
                preload: preload,
                create: create,
            },
            backgroundColor: '#ffffff', // white background
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
    
        function create() {

            // cardFiles.forEach((cardFile) => {
            //     const card = this.physics.add.image(window.innerWidth / 2, window.innerHeight / 2, cardFile);
            //     card.setCollideWorldBounds(true);
            //     card.setScale(0.1, 0.1)
            //     card.setInteractive({ draggable: true });

            //     card.on('dragstart', function (pointer) {
            //         this.setDepth(1);
            //     });

            //     card.on('drag', function (pointer, dragX, dragY) {
            //         this.x = dragX;
            //         this.y = dragY;
            //     });

            //     card.on('dragend', function (pointer) {
            //         this.setDepth(0);
            //     });
            // });



        }
    
        // Function to handle window resize
        function resize() {
            game.scale.resize(window.innerWidth, window.innerHeight);
            game.scene.scenes.forEach(scene => {
                if (scene.cameras.main) {
                    scene.physics.world.setBounds(0, 0, scene.cameras.main.width, scene.cameras.main.height);
                }
            });
        }
    
        // Add event listener for window resize
        window.addEventListener('resize', resize);
    
        // Remove event listener when the component is unmounted
        return () => window.removeEventListener('resize', resize);
    }, []);    
};

export default PhaserComponent;
