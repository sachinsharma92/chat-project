import * as Tabs from '@radix-ui/react-tabs';
import DialogCloseButton from '@/ui/common/DialogCloseButton';
import '../../common/styles/Tabs.css';
import './Account.css';
import AccountInfo from './AccountInfo';
import CloneAISettings from './CloneAISettings';

const Account = () => {
  return (
    <div className="account-dialog">
      <Tabs.Root className="tabs-root" defaultValue="myAccount">
        <Tabs.List className="tabs-list" aria-label="Manage your account">
          <Tabs.Trigger className="tabs-trigger" value="myAccount">
            Account
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="myAIClone">
            AI Clone Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="myAccount">
          <AccountInfo />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="myAIClone">
          <CloneAISettings />
        </Tabs.Content>
      </Tabs.Root>

      <DialogCloseButton />
    </div>
  );
};

export default Account;
