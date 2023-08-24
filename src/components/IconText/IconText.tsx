import './IconText.css'

interface IconTextProps {
  src: string;
  text: string;
}

function IconText({src, text} : IconTextProps) {

  return (
    <div className="icontext-container">
     <img src={src} className="icon" alt="Icon Image" />
     <p className="text-label"> {text} </p>
    </div>
  )
}

export default IconText
