import cx from 'classnames';
import { EllipseIcon, MembersIcon } from '@/icons';
import { size } from 'lodash';
import { useGameServer } from '@/store/Spaces';
import './SpaceStatistics.css';

const SpaceStatistics = (props: { collapsed?: boolean }) => {
  const { collapsed } = props;
  const [players] = useGameServer(state => [state.players, state.room]);

  return (
    <div className={'info-stats flex justify-start items-center'}>
      <div
        className={cx('info-members flex justify-start items-center hidden', {
          'info-members-collapsed hidden': collapsed,
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
        <p>{`${size(players)} online`}</p>
      </div>
    </div>
  );
};

export default SpaceStatistics;
