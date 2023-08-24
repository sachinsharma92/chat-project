import InfoSidebar from '../InfoSidebar/InfoSidebar';
import Avatar from '../Avatar/Avatar';
import './MainComponent.css';
import CameraButton from '../CameraButton/CameraButton';
import MessageBox from '../MessageBox/MessageBox';

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
      <div className="footer">
          <MessageBox />
      </div>

    </>
  );
}

export default MainComponent;
