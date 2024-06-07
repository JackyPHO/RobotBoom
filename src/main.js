// Jacky Ho
// Created: 5/06/2024
// Phaser: 3.70.0
//
// Robot Boom
//
// Implementing a shooter gallery for Game 2b
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60 },   // ensure consistent timing across machines
    width: 800,
    height: 600,
    scene: [Robot]
}


const game = new Phaser.Game(config);