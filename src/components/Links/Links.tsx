import { map } from 'lodash';
import './Links.css';

function Links({ socials }: { socials: any[] }) {
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
