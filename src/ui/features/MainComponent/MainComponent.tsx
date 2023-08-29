import InfoSidebar from '../InfoSidebar/InfoSidebar';
import CameraButton from '../CameraButton/CameraButton';
import './MainComponent.css';
import StickyChat from '../Chat/StickyChat';
import Avatar from '@/ui/common/Avatar/Avatar';

function MainComponent({ handleCameraButtonClick }: any) {
  return (
    <>
      <div className="main-component">
        <InfoSidebar />
        <div className="right-sidebar">
          <Avatar src="/assets/avatarImage.svg" />
          <CameraButton onButtonClick={handleCameraButtonClick} />
        </div>
      </div>
      <StickyChat />
    </>
  );
}

export default MainComponent;
