import { ReactNode } from 'react';
import { ChatIcon, StoreIcon } from '@/icons';
import './Apps.css';

const AppItem = (props: { name: string; icon: ReactNode }) => {
  const { name, icon } = props;

  return (
    <div className="app-item flex justify-start items-center">
      <div className="flex justify-center items-center">{icon || null}</div>
      <p> {name} </p>
    </div>
  );
};

const Apps = () => {
  return (
    <div className="apps">
      <AppItem name="Store" icon={<StoreIcon />} />
      <AppItem
        name="Chat"
        icon={
          <div className="chat-icon flex justify-center items-center">
            <ChatIcon />
          </div>
        }
      />
    </div>
  );
};

export default Apps;
