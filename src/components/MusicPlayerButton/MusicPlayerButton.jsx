import './MusicPlayerButton.css';

function MusicPlayerButton() {
  return (
    <div className="mp-button-container">
      <img src={'/assets/pause-button.svg'} className="pause-button" />
    </div>
  );
}

export default MusicPlayerButton;
