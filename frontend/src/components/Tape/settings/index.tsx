import React from 'react';
import Account from './account';
import Notifications from './notifications';
import Profile from './profile';
import Security from './security';
import { routes } from '../../../constants';
import Cover from '../chat/cover';
import { authState } from '../../../hooks/recoil/auth';
import { useRecoilValue } from 'recoil';
import { instanceOfUser } from '../../../hooks/recoil/user';

type PropsType = {
  current?: string;
};

const SettingsContent = ({ current }: PropsType) => {
  const iam = useRecoilValue(authState);

  const getPage = () => {
    if (instanceOfUser(iam))
      switch (current) {
        case routes.settings.account:
          return <Account iam={iam} />;
        case routes.settings.notifications:
          return <Notifications />;
        case routes.settings.profile:
          return <Profile iam={iam} />;
        case routes.settings.security:
          return <Security iam={iam} />;

        default:
          return null;
      }
  };
  if (current === routes.settings.index && instanceOfUser(iam)) {
    return <Cover iam={iam} title="Please select a settings menu" />;
  }
  return (
    <div className="chat">
      <div className="page-content">{getPage()}</div>
    </div>
  );
};

export default SettingsContent;
