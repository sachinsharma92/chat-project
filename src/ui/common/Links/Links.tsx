import { map } from 'lodash';
import './Links.css';
import { LinkIcon } from '@/icons';

export interface SocialLink {
  name: string;
  link: string;
}

function Links({ socials }: { socials: SocialLink[] }) {
  return (
    <div className="links-layout">
      {map(socials, item => {
        return (
          <div className="links-wrapper" key={item.name}>
            <LinkIcon />
            <a
              href={item.link}
              target="_blank"
              className="link-label"
              rel="noreferrer"
            >
              {item.name}
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default Links;
