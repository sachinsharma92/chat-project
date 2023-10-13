import * as Tabs from '@radix-ui/react-tabs';
import DialogCloseButton from '@/ui/common/DialogCloseButton';
import '../../common/styles/Tabs.css';
import './Account.css';
import AccountInfo from './AccountInfo';
import CloneAISettings from './CloneAISettings';
import SpaceSettings from './SpaceSettings';

export enum AccountSettingsTab {
  'accountSettings' = 'accountSettings',
  'cloneAISettings' = 'cloneAISettings',
  'spaceSettings' = 'spaceSettings',
}

const Account = () => {
  return (
    <div className="account-dialog">
      <Tabs.Root
        className="tabs-root"
        defaultValue={AccountSettingsTab.accountSettings}
      >
        <Tabs.List className="tabs-list" aria-label="Manage your account">
          <Tabs.Trigger
            className="tabs-trigger"
            value={AccountSettingsTab.accountSettings}
          >
            Account
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tabs-trigger"
            value={AccountSettingsTab.cloneAISettings}
          >
            AI Clone Settings
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tabs-trigger"
            value={AccountSettingsTab.spaceSettings}
          >
            Space Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="tabs-content"
          value={AccountSettingsTab.accountSettings}
        >
          <AccountInfo />
        </Tabs.Content>
        <Tabs.Content
          className="tabs-content"
          value={AccountSettingsTab.cloneAISettings}
        >
          <CloneAISettings />
        </Tabs.Content>

        <Tabs.Content
          className="tabs-content"
          value={AccountSettingsTab.spaceSettings}
        >
          <SpaceSettings />
        </Tabs.Content>
      </Tabs.Root>

      <DialogCloseButton />
    </div>
  );
};

export default Account;
