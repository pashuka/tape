import React from 'react';

import { routes } from '../../../constants';
import { UserType } from '../../../hooks/recoil/user';

type CoverPropsType = {
  iam: UserType;
};

const Cover = ({ iam }: CoverPropsType) => {
  return (
    <div className="chat flex-column justify-content-center text-center bg-white">
      <div className="container-xxl">
        <div className="avatar avatar-lg mb-3">
          {iam.profile && iam.profile.picture && (
            <img
              className="avatar-img"
              src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${iam.profile.picture}`}
              alt=""
            />
          )}
        </div>

        <h6>Hey, {iam.realname || iam.username}!</h6>
        <p className="text-muted">Please select a dialog to start messaging</p>
      </div>
    </div>
  );
};

export default Cover;
