import cx from 'classnames';
import { useEffect } from 'react';
import { ChatIcon, CrossIcon } from '@/icons';
import { useAppStore } from '@/store';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import Button from '@/ui/common/Button';
import { InterTight } from '@/app/fonts';
import './Bulletin.css';

const Bulletin = () => {
  const [expandBulletinSidebar, setExpandBulletinSidebar] = useAppStore(
    state => [state.expandBulletinSidebar, state.setExpandBulletinSidebar],
  );
  const { availableWidth } = useWindowResize();

  /**
   * Hide bulletin on resize and hits mobile screen expected breakpoint
   */
  useEffect(() => {
    if (availableWidth < mobileWidthBreakpoint && expandBulletinSidebar) {
      setExpandBulletinSidebar(false);
    }
  }, [availableWidth, expandBulletinSidebar, setExpandBulletinSidebar]);

  return (
    <div
      className={cx('bulletin', { 'bulletin-hide': !expandBulletinSidebar })}
    >
      <div className="bulletin-header">
        <div className="bulletin-left">
          <ChatIcon height={'16px'} width={'16px'} />
          <h1 className={cx(InterTight.className, 'bulletin-label')}>
            Bulletin
          </h1>
        </div>
        <div className="bulletin-right">
          <Button
            className="bulletin-close"
            onClick={() => setExpandBulletinSidebar(false)}
          >
            <CrossIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bulletin;
