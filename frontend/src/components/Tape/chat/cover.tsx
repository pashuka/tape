import React from 'react';

import { routes } from '../../../constants';
import { UserType } from '../../../hooks/recoil/user';
import Avatar from '../components/avatar';

type CoverPropsType = {
  iam: UserType;
};

const Cover = ({ iam }: CoverPropsType) => {
  return (
    <div className="chat flex-column justify-content-center text-center bg-white">
      <div className="container-xxl">
        <Avatar
          picture={iam.profile?.picture}
          realname={iam.realname}
          username={iam.username}
          size="lg"
        />
        <h6 className="mt-1">Hey, {iam.realname || iam.username}!</h6>
        <p className="text-muted">Please select a dialog to start messaging</p>
      </div>
    </div>
  );
};

export default Cover;
