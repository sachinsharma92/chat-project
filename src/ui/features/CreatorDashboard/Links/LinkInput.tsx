import { ISpaceLink } from '@/types';
import { useSpacesStore } from '@/store/App';
import { useCreatorSpace, useDebounce } from '@/hooks';
import { filter, map, toString } from 'lodash';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { saveSpacePropertiesQueue } from '@/store/SpacesProvider';
import { updateSpaceLinks } from '@/lib/supabase/links';
import { Switch } from '@/components/ui/switch';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import './LinkInput.css';

const LinkInput = (props: { linkInfo: Partial<ISpaceLink> }) => {
  const { linkInfo } = props;
  const [setSpaceInfo] = useSpacesStore(state => [state.setSpaceInfo]);
  const { spaceInfo, spaceId } = useCreatorSpace();
  const links = useMemo(
    () => spaceInfo?.links?.data || [],

    // eslint-disable-next-line
    [spaceInfo, spaceInfo?.links?.data],
  );
  const { register, getValues } = useForm();

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

        await updateSpaceLinks(spaceId, updatedLinks);
      });
    }
  };

  /**
   * Save link/name input changes
   */
  const saveLinkForm = useDebounce((property = '') => {
    console.log('saveLinkForm() property', property);

    saveSpacePropertiesQueue.add(async () => {
      // save link change

      const { name, link } = getValues();
      const updatedLinks = map(links, l => {
        if (l?.id === linkInfo?.id) {
          return {
            ...l,
            ...linkInfo,
            ...(property === 'link' && {
              link,
            }),
            ...(property === 'name' && {
              name,
            }),
          };
        }

        return l;
      });

      if (spaceId) {
        setSpaceInfo(spaceId, { links: { data: updatedLinks } });
        await updateSpaceLinks(spaceId, updatedLinks);
      }
    });
  }, 400);

  /**
   * Toggle hide/unhide link
   */
  const toggleHideLink = () => {
    saveSpacePropertiesQueue.add(async () => {
      const linkId = linkInfo?.id;
      const updatedLinks = map(links, l => {
        if (linkId && l?.id === linkId) {
          return { ...l, hidden: !Boolean(l?.hidden) };
        }

        return l;
      });

      if (spaceId) {
        setSpaceInfo(spaceId, { links: { data: updatedLinks } });
        await updateSpaceLinks(spaceId, updatedLinks);
      }
    });
  };

  return (
    <div className="link-input-container">
      <form>
        <div className="link-input-name">
          <TextInput
            placeholder="Title"
            type="text"
            {...register('name', {
              onChange() {
                saveLinkForm('name');
              },
              value: linkInfo?.name || '',
              required: false,
            })}
          />
        </div>

        <div className="link-input-url">
          <TextInput
            placeholder="https://facebook.com/you"
            type="text"
            {...register('link', {
              onChange() {
                saveLinkForm('link');
              },
              value: linkInfo?.link || '',
              required: false,
            })}
          />
        </div>
      </form>

      <div className="link-input-actions">
        <Switch
          className="toggle-hide"
          checked={!linkInfo?.hidden}
          onClick={toggleHideLink}
        />
        <Button
          className="link-input-delete"
          onClick={() => removeLink(toString(linkInfo?.id))}
        >
          <p>Delete</p>
        </Button>
      </div>
    </div>
  );
};

export default LinkInput;
