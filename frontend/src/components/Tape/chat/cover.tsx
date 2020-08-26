import React from 'react';

import { UserType } from '../../../hooks/recoil/user';
import Avatar from '../components/avatar';
import { useTranslation } from 'react-i18next';

type CoverPropsType = {
  title?: string;
  iam: UserType;
};

const Cover = ({ title, iam }: CoverPropsType) => {
  const { t } = useTranslation();
  return (
    <div className="chat flex-column justify-content-center text-center bg-white">
      <div className="container-xxl">
        <Avatar picture={iam.profile?.picture} size="lg" />
        <h6 className="mt-1">
          {t('Hey')}, {iam.realname || iam.username}!
        </h6>
        <p className="text-muted">
          {t(title || 'Please select a dialog to start messaging')}
        </p>
      </div>
    </div>
  );
};

export default Cover;
