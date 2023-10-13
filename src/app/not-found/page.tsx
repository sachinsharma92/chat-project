import { BotnetIcon } from '@/icons';
import './page.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="app-logo">
          <BotnetIcon height={64} width={64} />
        </div>
        <div className="not-found-text">
          <h1>404</h1>
          <p>{"This page doesn't exist."}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
