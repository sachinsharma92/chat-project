// import { toPng } from 'html-to-image';
import './CameraButton.css';

function CameraButton({ onButtonClick }: any) {
  // const onButtonClick = useCallback(() => {
  //   if (ref.current === null) {
  //     return;
  //   }

  //   toPng(ref.current, { cacheBust: true })
  //     .then(dataUrl => {
  //       const link = document.createElement('a');
  //       link.download = 'image.png';
  //       link.href = dataUrl;
  //       link.click();
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, [ref]);

  return (
    <div className="camera-button-container" onClick={onButtonClick}>
      <img
        src={'/assets/camera-icon.svg'}
        alt={'Screenshot icon'}
        className="camera-button"
      />
    </div>
  );
}

export default CameraButton;
