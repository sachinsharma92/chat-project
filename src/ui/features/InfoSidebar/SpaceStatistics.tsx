import { EllipseIcon, MembersIcon } from '@/icons';
import './SpaceStatistics.css';
import cx from 'classnames';

const SpaceStatistics = (props: { collapsed?: boolean }) => {
  const { collapsed } = props;

  return (
    <div className={'info-stats flex justify-start items-center'}>
      <div
        className={cx('info-members flex justify-start items-center', {
          'info-members-collapsed': collapsed,
        })}
      >
        <MembersIcon /> <p>23 members</p>
      </div>
      <div
        className={cx('info-online flex justify-start items-center', {
          'info-online-collapsed': collapsed,
        })}
      >
        <EllipseIcon />
        <p>2 online</p>
      </div>
    </div>
  );
};

export default SpaceStatistics;
