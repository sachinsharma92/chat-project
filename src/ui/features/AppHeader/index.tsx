import { BotnetIcon, ExploreIcon, SpacesIcon } from '@/icons';
import './AppHeader.css';
import Button from '@/ui/common/Button';

const AppHeader = () => {
  return (
    <div className="app-header">
      <div className="left flex">
        <Button className="logo flex justify-center">
          <BotnetIcon />
        </Button>
      </div>
      <div className="center flex">
        <Button className="spaces flex justify-center">
          <SpacesIcon />
          <p>Spaces</p>
        </Button>
        <Button className="explore ml-2 flex justify-center">
          <ExploreIcon />
          <p>Explore </p>
        </Button>
      </div>
      <div className="right flex justify-center">
        <Button className="sign-in flex justify-center">
          <p>Sign In</p>
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
