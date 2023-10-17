import { map } from 'lodash';
import { ArrowTopRightIcon, LinkIcon } from '@/icons';
import './Links.css';
import { ISpaceLink } from '@/types';

function Links({ socials }: { socials: ISpaceLink[] }) {
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
