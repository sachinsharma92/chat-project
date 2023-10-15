import { map } from 'lodash';
import './AppsList.css';
import IconText from '@/components/common/IconText/IconText';

interface apps {
  name: string;
  icon: string;
}

interface AppsListProps {
  appsList: apps[];
}

function AppsList({ appsList }: AppsListProps) {
  return (
    <div className="appslist-container">
      <p className="info-label"> Apps </p>
      {map(appsList, item => {
        return (
          <div className="apps-wrapper" key={item.name}>
            <IconText src={item.icon} text={item.name} />
          </div>
        );
      })}
    </div>
  );
}

export default AppsList;
