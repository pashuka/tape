import React from 'react';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilValueLoadable } from 'recoil';
import Skeleton from '../../../Skeleton';
import Avatar from '../../components/avatar';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);

declare type PropsType = {
  username: string;
};

const HeaderWithUserInfo = ({ username }: PropsType) => {
  const { t } = useTranslation();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  const title =
    state === 'loading' ? (
      <Skeleton width="128px" />
    ) : state === 'hasValue' && instanceOfUser(contents) ? (
      contents.realname || `@${contents.username}`
    ) : null;
  return (
    <div className="col-8 col-xl-8">
      <div className="media text-center text-xl-left">
        <div className="d-none d-xl-inline-block text-center mr-3">
          <Avatar
            pending={state === 'loading'}
            picture={instanceOfUser(contents) ? contents.profile.picture : ''}
            size="md"
          />
        </div>
        <div className="media-body align-self-center text-truncate">
          <h6 className="text-truncate m-0">{title}</h6>
          <small className="text-muted">{t('no messages')}</small>
        </div>
      </div>
    </div>
  );
};
export default HeaderWithUserInfo;
