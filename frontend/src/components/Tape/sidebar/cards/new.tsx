import React from 'react';
import IPerson from '@material-ui/icons/Person';
import ICancel from '@material-ui/icons/Cancel';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';

import { routes } from '../../../../constants';
import { userInfoQuery } from '../../../../hooks/recoil/user';

type PropsType = {
  username: string;
};

const CardNew = ({ username }: PropsType) => {
  const isOnline = false;
  const participant = useRecoilValue(userInfoQuery(username));

  return (
    <div className="nav-link text-body p-0 m-1">
      <div className="card border-0 rounded-0 alert-primary">
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div
              className={`avatar ${
                isOnline ? 'avatar-online' : ''
              } mt-2 mb-2 mr-3`}
            >
              {participant?.profile?.picture ? (
                <img
                  className="avatar-img"
                  src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant?.profile?.picture}`}
                  alt={participant?.realname || participant?.username}
                />
              ) : (
                <IPerson fontSize="large" className="ml-2 mt-2 text-white" />
              )}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center mt-2 pt-1">
                <h6 className="text-truncate mb-0 mr-auto">
                  {participant?.realname || `@${participant?.username}`}
                </h6>
                <Link
                  className="btn btn-link text-gray-400 text-nowrap"
                  to={`/${routes.tape}/${routes.dialogs}/`}
                >
                  <ICancel className="" />
                </Link>
              </div>
              {/* <div className="text-gray-100 text-truncate text-left">...</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNew;
