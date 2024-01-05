import { ReactNode } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { isEmpty, isString } from 'lodash';
import cx from 'classnames';
import * as RadixPopover from '@radix-ui/react-popover';
import './Popover.css';

const Popover = (props: {
  setPopoverToggle?: (open: boolean) => void;
  isOpen?: boolean;
  trigger: ReactNode;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}) => {
  const { side, children, trigger, ariaLabel, className, isOpen, setPopoverToggle } = props;

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={(open) => setPopoverToggle(open)}>
      <RadixPopover.Trigger
        asChild
        {...(!isEmpty(ariaLabel) && { 'aria-label': `${ariaLabel}` })}
      >
        {trigger}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={cx('popover-content', {
            [`${className}`]: !isEmpty(className) && isString(className),
          })}
          sideOffset={5}
          {...(side && { side })}
        >
          {children}
          <RadixPopover.Close
            className="popover-close"
            aria-label="Popover Close"
          >
            <Cross2Icon />
          </RadixPopover.Close>
          <RadixPopover.Arrow className="popover-arrow" />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
