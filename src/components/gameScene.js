import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import background from './assets/background (2).jpg';
import ballImage from './assets/ball.png';

const GameScene = ({ socket }) => {

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
        .setCollideWorldBounds(true).setBounce(1, 1)

      ballRef.current = ball;
      this.physics.world.setBoundsCollision(true, true, true, true);
      this.physics.add.collider(ball, this.physics.world.bounds);

      socket.emit('initial-ball', { x: ball.x, y: ball.y });
    }

    return () => {
      game.destroy(true);
    };

  }, [socket]);

  useEffect(() => {
    socket.on('initial-position', ({ x, y }) => {
      if (ballRef.current) {
        ballRef.current.setPosition(x, y);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('move-ball', (wallPosition) => {
      if (ballRef.current) {
          const speed = 900;        
          const angle = Phaser.Math.Angle.Between(
            ballRef.current.x,
            ballRef.current.y,
            wallPosition.x,
            wallPosition.y,
          );
          const velocityX =(Math.cos(angle) * speed);
          const velocityY = (Math.sin(angle) * speed);
          ballRef.current.setVelocity(velocityX, velocityY);
      }
    })
    
    return () => {
      socket.off('move-ball'); // Remove the listener when component unmounts
    };

  }, [socket]);

  return <div id="phaser-game" ref={GameRef} />;
};

export default GameScene;