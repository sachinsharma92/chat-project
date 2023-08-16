import { useState } from 'react'
import linkIcon from '../../assets/link-icon.svg'
import './Links.css'


function Links ({socials}) {

  return (
    <div className="links-layout">
     {socials?.map(item => {
      return(
        <div className="links-wrapper" key={item.name}>
            <img src={linkIcon} className="link-icon" />
            <a href={item.link} target="_blank" className="link-label"> {item.name} </a>
        </div>
      )
     })}
    </div>
  )
}

export default Links
