import InfoSidebar from '../InfoSidebar/InfoSidebar';
import Avatar from '../Avatar/Avatar';
import './MainComponent.css';
import CameraButton from '../CameraButton/CameraButton';

function MainComponent({handleCameraButtonClick}: any) {
  return (
    <>
      <div className="main-component">
        <InfoSidebar />
        <div className="right-sidebar">
          <Avatar />
          <CameraButton onButtonClick={handleCameraButtonClick} />
        </div>
      </div>
    </>
  );
}

export default MainComponent;
