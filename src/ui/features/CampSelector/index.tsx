import { useCampStore } from '@/store';
import { map } from 'lodash';
import { SearchIcon } from '@/icons';
import CampItem from './CampItem';
import Button from '@/ui/common/Button';
import UserAvatar from '@/ui/common/UserAvatar';
import './CampSelector.scss';

export const campSelectorElementId = 'campSelectorElementId';

const CampSelector = () => {
  const camps = useCampStore(state => state?.camps);

  return (
    <div id={campSelectorElementId} className="camp-selector flex flex-col">
      <ul className="camps flex flex-col">
        {map(camps, camp => {
          const { id } = camp;
          const key = `camp${id}`;

          return (
            <li key={key} className="flex justify-center">
              <CampItem camp={camp} />
            </li>
          );
        })}

        <li className="search-item flex justify-center">
          <Button className="search-button flex justify-center">
            <SearchIcon />
          </Button>
        </li>
      </ul>

      <UserAvatar />
    </div>
  );
};

export default CampSelector;
