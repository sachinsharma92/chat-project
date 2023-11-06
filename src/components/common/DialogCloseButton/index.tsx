import { CrossIcon } from '@/icons';
import { useAppStore } from '@/store/App';
import { isFunction } from 'lodash';
import { DialogEnums } from '@/types/dialog';
import './DialogCloseButton.css';

const DialogCloseButton = () => {
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);

  return (
    <button
      className="dialog-close-button"
      onClick={() => {
        if (isFunction(setShowDialog)) {
          setShowDialog(false, DialogEnums.none);
        }
      }}
    >
      <CrossIcon />
    </button>
  );
};

export default DialogCloseButton;
