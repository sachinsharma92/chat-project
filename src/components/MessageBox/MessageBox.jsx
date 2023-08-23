import './MessageBox.css';

function MessageBox() {
  return (
    <div className="message-box-container">
      <div className="messenger-container">
        <input
          type="text"
          id="message"
          name="message"
          placeholder="Press ENTER to chat"
        />
        <img
          src={'/assets/messenger-icon.svg'}
          className="messenger-icon"
          alt="Messenger Icon"
        />
      </div>
    </div>
  );
}

export default MessageBox;
