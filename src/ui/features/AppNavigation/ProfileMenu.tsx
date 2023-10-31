import Button from '@/components/common/Button';
import Popover from '@/components/common/Popover';
import { useAppStore } from '@/store/App';
import { PersonIcon } from '@radix-ui/react-icons';
import { isFunction } from 'lodash';
import { useRouter } from 'next/navigation';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);
  const router = useRouter();

  /**
   * Navigate to auth page on click
   */
  const showSignInDialog = () => {
    if (isFunction(setShowDialog)) {
      router.push('/auth');
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
