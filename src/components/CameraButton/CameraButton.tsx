import './CameraButton.css';

function CameraButton() {
  return (
    <div className="camera-button-container">
      <img src={'/assets/camera-icon.svg'} className="camera-button" />
    </div>
  );
}

export default CameraButton;
