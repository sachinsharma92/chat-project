import { useState } from 'react'
import gameBackground from '../../assets/game-window-sample.png'

function GameWindow() {

  return (
    <div className="game-window-layout">
       <img src={gameBackground} className="game-background" />
    </div>
  )
}

export default GameWindow
