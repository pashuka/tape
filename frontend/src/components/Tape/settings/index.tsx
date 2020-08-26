import React from 'react';
import Account from './account';
import Notifications from './notifications';
import Profile from './profile';
import Security from './security';
import { routes } from '../../../constants';
import Cover from '../chat/cover';
import { authState } from '../../../hooks/recoil/auth';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import {
  instanceOfUser,
  userInfoQuery,
  UserType,
} from '../../../hooks/recoil/user';
import Overlay from '../../Overlay';

type PropsType = {
  current?: string;
};

const SettingsContent = ({ current }: PropsType) => {
  const auth = useRecoilValue(authState);
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: auth?.username || '' }),
  );
  const [iam, setIam] = React.useState<UserType | undefined>();
  React.useEffect(() => {
    if (state === 'hasValue' && instanceOfUser(contents)) {
      setIam(contents);
    }
  }, [state, contents]);

  if (!iam) return <Overlay />;

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
