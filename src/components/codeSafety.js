import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import background from './assets/background (2).jpg';
import ballImage from './assets/ball.png';

const GameScene = ({ ballVelocity}) => {

  const ballRef = useRef(null);
  const GameRef = useRef(null);

  useEffect(() => {
    const gameConfig = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 800,
      height: 400,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    };

    const game = new Phaser.Game(gameConfig);
    GameRef.current = game;
   
    function preload() {
      this.load.image('background', background)
      this.load.image('ball', ballImage)
    }
    function create() {
      const bg = this.add.image(400, 200, 'background')
      const width1 = 800;
      const height1 = 400;
      bg.setScale(width1 / bg.width, height1 / bg.height);

      const initialVelocityX = Phaser.Math.Between(-900, 900);
      const initialVelocityY = Phaser.Math.Between(-900, 900);

      const ball = this.physics.add.image(400, 200, 'ball').setScale(0.05)
        .setVelocity(initialVelocityX, initialVelocityY)
        .setCollideWorldBounds(true).setBounce(1,1)
    
        ballRef.current = ball;
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.add.collider(ball, this.physics.world.bounds);
          }

    function update() {
    
    }

    return () => {
      game.destroy(true);
    };

  }, []);

  useEffect(() => {
    if (ballRef.current && ballVelocity) {
      let newVelocity = { x: 0, y: 0 };
      switch (ballVelocity) {
        case 'left1':
          newVelocity = { x: -900, y: 0 };
          break;
        case 'right1':
          newVelocity = { x: 900, y: 0 };
          break;
        case 'left2':
          newVelocity = { x: -600, y: 0 };
          break;
        case 'right2':
          newVelocity = { x: 600, y: 0 };
          break;
        case 'top-left':
          newVelocity = { x: -900, y: -900 };
          break;
        case 'top-right':
          newVelocity = { x: 900, y: -900 };
          break;
        case 'bottom-left':
          newVelocity = { x: -900, y: 900 };
          break;
        case 'bottom-right':
          newVelocity = { x: 900, y: 900 };
          break;
        default:
          newVelocity = { x: -900, y: 900 };
      }
      ballRef.current.setVelocity(newVelocity.x, newVelocity.y);
    }
  }, [ballVelocity]);

  return <div id="phaser-game" ref={GameRef} />;
};



import React, { useState } from "react";
import GameScene from "./gameScene";


const MainGame = ()=>{
   const [ballVelocity, setBallVelocity] = useState();

  const handleButtonClick = (wallIndex) => {
    setBallVelocity(wallIndex);
    };

    return(
        <div className="main">
        <div className="top-button">
          <button type="button" onClick={() => handleButtonClick('top-left')}>Top Left</button>
          <button type="button" onClick={() => handleButtonClick('top-right')}>Top Right</button>
        </div>
        <div className="rlButton">
          <div className="left">
          <button type="button" onClick={() => handleButtonClick('left1')}>Left</button>
          <button type="button" onClick={() => handleButtonClick('left2')}>Left</button>
          </div>         
          <GameScene ballVelocity={ballVelocity} setBallVelocity={setBallVelocity}/> 
          <div className="right">
          <button type="button" onClick={() => handleButtonClick('right1')}>Right</button>
          <button type="button" onClick={() => handleButtonClick('right2')}>Right</button>
          </div>        
        </div>
        <div className="bottom-button">
          <button type="button" onClick={() => handleButtonClick('bottom-left')}>Bottom Left</button>
          <button type="button" onClick={() => handleButtonClick('bottom-right')}>Bottom Right</button>
        </div>
      </div>
    );
}
 export default MainGame;