import React, { useEffect } from 'react';
import Phaser from 'phaser';

const PhaserComponent = () => {
    useEffect(() => {
        let game;
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: {
                preload: preload,
                create: create,
            },
            backgroundColor: '#ffffff', // white background
        };
    
        game = new Phaser.Game(config);
        // names of all the cards in the game
        let cardFiles = ['blue0.png', 'blue1.png', 'blue2.png'];
        function preload() {
            cardFiles.forEach((cardFile) => {
                this.load.image(cardFile.split('.')[0], 'cards/' + cardFile);
            });
        }
    
        function create() {
            //this.add.image(400, 300, 'sky');
            const logo = this.physics.add.image(window.innerWidth / 2, window.innerHeight / 2, 'blue2');
            logo.setVelocity(100, 200);
            logo.setBounce(1, 1);
            logo.setCollideWorldBounds(true);
            logo.setScale(0.1, 0.1)


        }
    
        // Function to handle window resize
        function resize() {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }
    
        // Add event listener for window resize
        window.addEventListener('resize', resize);
    
        // Remove event listener when the component is unmounted
        return () => window.removeEventListener('resize', resize);
    }, []);    
};

export default PhaserComponent;
