import Button from '@/components/common/Button';
import Popover from '@/ui/common/Popover';
import { useAppStore } from '@/store/Spaces';
import { PersonIcon } from '@radix-ui/react-icons';
import { isFunction } from 'lodash';
import { DialogEnums } from '@/types/dialog';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);

  const showSignInDialog = () => {
    if (isFunction(setShowDialog)) {
      setShowDialog(true, DialogEnums.auth);
    }
  };

  return (
    <Popover
      trigger={
        <Button className="sign-in">
          <PersonIcon height={16} width={16} />
        </Button>
      }
    >
      <div className="profile-menu">
        <ul>
          <li>
            <Button onClick={showSignInDialog}>
              <p>Sign up / Log in</p>
            </Button>
          </li>
        </ul>
      </div>
    </Popover>
  );
};

export default ProfileMenu;
