import { useState } from 'react'
import avatarImage from '../../assets/avatarImage.svg'
import './Avatar.css'


function Avatar() {

  return (
    <div className="avatar-layout">
     <img src={avatarImage} className="avatar" alt="Avatar Image" />
    </div>
  )
}

export default Avatar
