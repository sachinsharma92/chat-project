'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { useCreatorSpace } from '@/hooks';
import { useMemo } from 'react';
import { useSpacesStore } from '@/store/App';
import { map, size } from 'lodash';
import { v4 as uuid } from 'uuid';
import { saveSpacePropertiesQueue } from '@/store/SpacesProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

import Button from '@/components/common/Button';
import LinkInput from './LinkInput';
import './Links.css';

const Links = () => {
  const [setSpaceInfo] = useSpacesStore(state => [state.setSpaceInfo]);
  const { spaceInfo, spaceId } = useCreatorSpace();
  const links = useMemo(() => spaceInfo?.links?.data || [], [spaceInfo]);

  /**
   * Insert new link
   */
  const insertLink = () => {
    if (spaceId) {
      saveSpacePropertiesQueue.add(async () => {
        const updatedLinks = {
          data: [{ id: uuid(), name: '', link: '' }, ...links],
        };

        setSpaceInfo(spaceId, {
          links: updatedLinks,
        });
      });
    }
  };

  // Limit number of links to 20 right now
  const limitLinks = useMemo(() => size(links) >= 20, [links]);

  return (
    <TooltipProvider>
      <div className="links">
        <div className="flex justify-center items-center w-full mt-4 mb-4">
          <Button
            className="add-link-button"
            onClick={insertLink}
            isDisabled={limitLinks}
          >
            <PlusIcon height={20} width={20} />
            <p>Add Link</p>
          </Button>
        </div>

        <div className="link-list-container">
          <ul>
            {map(links, (linkInfo, idx) => {
              const key = `dashboardLinkItem${
                linkInfo?.id || linkInfo?.name
              }${idx}`;

              return (
                <li key={key}>
                  <LinkInput linkInfo={linkInfo} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Links;
