import React, { useEffect, useState } from "react";
import GameScene from "./gameScene";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000')

const MainGame = () => {

  const [ballVelocity, setBallVelocity] = useState(null);
  const [isAdminPlayed, setIsAdminPlayed] = useState(false)

 useEffect(()=>{
   socket.on('adminStatus', (isAdmin)=>{
    setIsAdminPlayed(isAdmin);
    console.log(isAdmin)
     } )
 },[])

  const handleButtonClick = (wallIndex) => {
    if(isAdminPlayed){
      socket.emit('admin-move-ball', wallIndex)
      console.log(isAdminPlayed)
      setBallVelocity(wallIndex);
    }
  };

  return (
   
    <div className="main">
       {isAdminPlayed ? "admin panel" : "user panel"}  
      <div className="top-button">
        <button type="button" onClick={() => handleButtonClick({x:50, y:0})} disabled={!isAdminPlayed}>Top Left</button>
        <button type="button" onClick={() => handleButtonClick({x: 800, y: 0})} disabled={!isAdminPlayed}>Top Right</button>
      </div>
      <div className="rlButton">
        <div className="left">
          <button type="button" onClick={() => handleButtonClick({ x: 0, y: 100})} disabled={!isAdminPlayed} >Left1</button>
          <button type="button" onClick={() => handleButtonClick({x:0, y:300 })} disabled={!isAdminPlayed}>Left2</button>
        </div>
        <GameScene socket={socket} />
        <div className="right">
          <button type="button" onClick={() => handleButtonClick({ x: 800, y: 100})} disabled={!isAdminPlayed} >Right1</button>
          <button type="button" onClick={() => handleButtonClick({ x: 800, y: 300})} disabled={!isAdminPlayed} >Right2</button>
        </div>
      </div>
      <div className="bottom-button">
        <button type="button" onClick={() => handleButtonClick({ x: 0, y: 500 })} disabled={!isAdminPlayed}>Bottom Left</button>
        <button type="button" onClick={() => handleButtonClick({ x: 800, y: 500 })} disabled={!isAdminPlayed}>Bottom Right</button>
      </div>
    </div>
  );
}
export default MainGame;