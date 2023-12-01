import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ISpaceLink } from '@/types';
import { useMemo } from 'react';
import { filter, isEmpty, map } from 'lodash';
import { LinkIcon } from '@/icons';

import './SpaceLinks.css';

const SpaceLinks = () => {
  const { spaceInfo } = useSelectedSpace();

  /**
   * Sanitized space links
   */
  const spaceLinks: ISpaceLink[] = useMemo(
    () =>
      filter(
        spaceInfo?.links?.data || [],
        linkInfo =>
          linkInfo &&
          !linkInfo.hidden &&
          !isEmpty(linkInfo?.link) &&
          !isEmpty(linkInfo?.name),
      ),
    [spaceInfo],
  );

  return (
    <div className="space-links">
      <ul>
        {map(spaceLinks, linkInfo => {
          const key = `${linkInfo?.name || linkInfo?.link}`;

          return (
            <li key={key}>
              <div className="link-container">
                <a
                  href={linkInfo.link}
                  target="_blank"
                  className="link-anchor"
                  rel="noreferrer"
                >
                  <LinkIcon />
                  <div className="link-texts">
                    <p>{linkInfo.name}</p>
                    <p>{linkInfo.link}</p>
                  </div>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SpaceLinks;
