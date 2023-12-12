'use client';

import { ISpaceLink } from '@/types';
import { useSpacesStore } from '@/store/App';
import { useCreatorSpace, useDebounce } from '@/hooks';
import { filter, map, toString } from 'lodash';
import { useMemo } from 'react';
import { saveSpacePropertiesQueue } from '@/store/SpacesProvider';
import { updateSpaceLinks } from '@/lib/supabase/links';
import { CrossIcon, LinkIcon } from '@/icons';

import './LinkInput.css';

import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';

const LinkInput = (props: { linkInfo: Partial<ISpaceLink> }) => {
  const { linkInfo } = props;
  const [setSpaceInfo] = useSpacesStore(state => [state.setSpaceInfo]);
  const { spaceInfo, spaceId } = useCreatorSpace();
  const links = useMemo(
    () => spaceInfo?.links?.data || [],

    // eslint-disable-next-line
    [spaceInfo, spaceInfo?.links?.data],
  );

  const storeUpdatedSpaceLinks = useDebounce(
    async (updatedLinks: ISpaceLink[]) => {
      if (spaceId) {
        await updateSpaceLinks(spaceId, updatedLinks);
      }
    },
    300,
  );

  /**
   * Save link/name input changes
   */
  const saveLinkForm = (property: string, link: string) => {
    saveSpacePropertiesQueue.add(async () => {
      // save link change

      const updatedLinks = map(links, l => {
        if (l?.id === linkInfo?.id) {
          return {
            ...l,
            ...linkInfo,
            ...(property === 'link' && {
              link,
            }),
            name: '',
          };
        }

        return l;
      });

      if (spaceId) {
        setSpaceInfo(spaceId, { links: { data: updatedLinks } });
        storeUpdatedSpaceLinks(updatedLinks);
      }
    });
  };

  /**
   * Delete target link
   * @param linkId
   * @param link
   */
  const removeLink = (linkId: string, link?: string) => {
    if (spaceId && linkId) {
      saveSpacePropertiesQueue.add(async () => {
        const updatedLinks = filter(
          links,
          linkInfo => linkInfo?.link !== link && linkInfo?.id !== linkId,
        );

        setSpaceInfo(spaceId, {
          links: {
            data: [...updatedLinks],
          },
        });

        storeUpdatedSpaceLinks(updatedLinks);
      });
    }
  };

  return (
    <div className="link-input-container">
      <div>
        <div className="link-input-url">
          <div className="relative flex justify-center items-center box-border">
            <LinkIcon height={'12px'} width={'12px'} />
          </div>

          <TextInput
            placeholder="https://facebook.com/you"
            type="text"
            value={linkInfo?.link}
            onChange={evt => {
              const value = toString(evt?.target?.value);
              saveLinkForm('link', value);
            }}
          />

          <Button
            className="relative flex justify-center items-center box-border"
            onClick={() => removeLink(linkInfo?.id || '')}
          >
            <CrossIcon height={'12px'} width={'12px'} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkInput;
