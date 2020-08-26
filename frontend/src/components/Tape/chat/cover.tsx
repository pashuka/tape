import React from 'react';

import {
  userInfoQuery,
  instanceOfUser,
  UserNameType,
} from '../../../hooks/recoil/user';
import Avatar from '../components/avatar';
import { useTranslation } from 'react-i18next';
import { useRecoilValueLoadable } from 'recoil';

type CoverPropsType = {
  title?: string;
  iam: UserNameType;
};

const Cover = ({ title, iam: { username } }: CoverPropsType) => {
  const { t } = useTranslation();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  return (
    <div className="chat flex-column justify-content-center text-center bg-white">
      <div className="m-auto">
        <Avatar
          pending={state === 'loading'}
          picture={instanceOfUser(contents) ? contents.profile.picture : ''}
          size="lg"
          styles="d-flex justify-content-center mb-3"
        />

        <h6 className="mt-1">
          {t('Hey')},{' '}
          {state === 'hasValue' && instanceOfUser(contents)
            ? contents.realname || contents.username
            : '...'}
          !
        </h6>
        <p className="text-muted">
          {t(title || 'Please select a dialog to start messaging')}
        </p>
      </div>
    </div>
  );
};

export default Cover;
