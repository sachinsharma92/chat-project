import InfoSidebar from '../InfoSidebar/InfoSidebar';
import './MainComponent.css';
import CameraButton from '../CameraButton/CameraButton';
import MessageBox from '../MessageBox/MessageBox';
import Avatar from '../ui/common/Avatar/Avatar';

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
      <div className="footer">
        <MessageBox />
      </div>
    </>
  );
}

export default MainComponent;
