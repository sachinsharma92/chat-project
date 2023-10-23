import { ReactNode, FC } from 'react';
import 'tailwindcss/tailwind.css';
import './Drawer.css';
import { isFunction } from 'lodash';

interface DrawerProps {
  isOpen: boolean;
  closeOnOverlayClick?: boolean;
  onClose?: () => void;
  content: ReactNode;
}

const DrawerComponent: FC<DrawerProps> = ({
  isOpen,
  closeOnOverlayClick,
  onClose,
  content,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={() => {
            if (isFunction(onClose) && closeOnOverlayClick) {
              onClose();
            }
          }}
        ></div>
      )}
      <div
        className={`drawer ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="drawer-content">{content}</div>
      </div>
    </>
  );
};

export default DrawerComponent;
