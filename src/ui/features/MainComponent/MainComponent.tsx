import InfoSidebar from '../InfoSidebar/InfoSidebar';
import CameraButton from '../CameraButton/CameraButton';
import './MainComponent.css';
import StickyChat from '../Chat/StickyChat';
import CampSelector from '../CampSelector';
import UserAvatar from '@/ui/common/UserAvatar';

function MainComponent({ handleCameraButtonClick }: any) {
  return (
    <>
      <div className="main-component fix-screen-overflow">
        <CampSelector />
        <div className="game-screen game-screen-shrink">
          <InfoSidebar />
          <div className="right-sidebar">
            <UserAvatar />
            <CameraButton onButtonClick={handleCameraButtonClick} />
          </div>
        </div>
      </div>
      <StickyChat />
    </>
  );
}

export default MainComponent;
