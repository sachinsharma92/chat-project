import { map } from 'lodash';
import { ArrowTopRightIcon, LinkIcon } from '@/icons';
import './Links.css';

export interface SocialLink {
  name: string;
  link: string;
}

function Links({ socials }: { socials: SocialLink[] }) {
  return (
    <div className="links-layout">
      {map(socials, item => {
        return (
          <div
            className="links-wrapper flex items-center justify-start"
            key={item.name}
          >
            <LinkIcon />
            <a
              href={item.link}
              target="_blank"
              className="link-label"
              rel="noreferrer"
            >
              {item.name}
            </a>
            <div className="arrow-icon flex justify-center items-centerP">
              <ArrowTopRightIcon height={'14px'} width={'14px'} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Links;
