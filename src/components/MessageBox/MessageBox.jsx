import { useState } from 'react'
import './MessageBox.css'
import messengerIcon from '../../assets/messenger-icon.svg'


function MessageBox() {

  return (
    <div className="message-box-container">
    <div className="messenger-container">
       <input type="text" id="message" name="message" placeholder="Press ENTER to chat" />
       <img src={messengerIcon} className="messenger-icon" alt="Messenger Icon" />
    </div>
    </div>
  )
}

export default MessageBox
