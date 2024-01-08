
import Modal from 'react-modal';
import './CustomModal.css';

type CustomModalProps = {
  closeModal?: any;
  children?: string | JSX.Element | JSX.Element[];
  modalIsOpen?: boolean;
  className?: string;
};

function CustomModal(props: CustomModalProps) {
  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      className={`dialog-section`}
      overlayClassName={props.className}
    >
      {props.children}
    </Modal>
  )
};

export default CustomModal;