import { useState } from 'react'
import './IconText.css'


function IconText({src, text}) {

  return (
    <div className="icontext-container">
     <img src={src} className="icon" alt="Icon Image" />
     <p className="text-label"> {text} </p>
    </div>
  )
}

export default IconText
