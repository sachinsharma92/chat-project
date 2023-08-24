import { map } from 'lodash';
import './Links.css';


interface social { 
  name: string;
  link: string;
}

function Links({ socials }: { socials: social[] }) {
  return (
    <div className="links-layout">
      {map(socials, item => {
        return (
          <div className="links-wrapper" key={item.name}>
            <img src={'/assets/link-icon.svg'} className="link-icon" />
            <a
              href={item.link}
              target="_blank"
              className="link-label"
              rel="noreferrer"
            >
              {' '}
              {item.name}{' '}
            </a>
          </div>
        );
      })}
    </div>
  );
}
 
export default Links;
