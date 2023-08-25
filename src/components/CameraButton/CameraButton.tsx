import './CameraButton.css';

function CameraButton({onButtonClick}: any) {

  return (
    <div className="camera-button-container" onClick={onButtonClick} >
      <img src={'/assets/camera-icon.svg'} className="camera-button" />
    </div>
  );
}

export default CameraButton;
