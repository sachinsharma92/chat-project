import { includes, map, size, toString } from 'lodash';
import { ArrowTopRightIcon, LinkIcon } from '@/icons';
import { ISpaceLink } from '@/types';
import { useMemo } from 'react';

import './Links.css';

const Links = (props: { links: ISpaceLink[] }) => {
  const { links } = props;
  const sanitizedLinks = useMemo(
    () =>
      map(links, linkInfo => {
        let formattedLink = toString(linkInfo?.link);

        if (!formattedLink?.startsWith('http')) {
          formattedLink = `https://${formattedLink}`;
        }

        if (includes(formattedLink, 'http://')) {
          // format to secure protocol
          formattedLink = `https://${formattedLink.substring(
            formattedLink.indexOf('http://') + size('http://'),
            size(formattedLink),
          )}`;
        }

        return {
          ...linkInfo,
          link: formattedLink,
        };
      }),

    [links],
  );

  return (
    <div className="links-layout">
      {map(sanitizedLinks, linkInfo => {
        return (
          <div
            className="links-wrapper flex items-center justify-start"
            key={linkInfo.name}
          >
            <a
              href={linkInfo.link}
              target="_blank"
              className="link-anchor"
              rel="noreferrer"
            >
              <LinkIcon />
              <p>{linkInfo.name}</p>
              <div className="arrow-icon flex justify-center items-centerP">
                <ArrowTopRightIcon height={'14px'} width={'14px'} />
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Links;
