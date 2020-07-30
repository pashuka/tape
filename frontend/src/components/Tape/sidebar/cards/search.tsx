import React from 'react';
import { Link } from 'react-router-dom';
import IPerson from '@material-ui/icons/Person';
import { useRecoilState, useRecoilValue } from 'recoil';

import { ParamsKeyUser, routes } from '../../../../constants';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { DialogsState } from '../../../../hooks/recoil/dialog';
import { authState } from '../../../../hooks/recoil/auth';
import { UserType } from '../../../../hooks/recoil/user';

type CardSearchPropsType = {
  isOnline?: boolean;
  user: UserType;
};

const CardSearch: React.FC<CardSearchPropsType> = ({ user, isOnline }) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const iam = useRecoilValue(authState);
  const dialogs = useRecoilValue(DialogsState);
  const dialog = dialogs?.find(
    ({ participants }) =>
      participants.length === 2 &&
      iam &&
      participants.includes(iam.username) &&
      participants.includes(user.username),
  );
  const linkParam = dialog
    ? `${dialog.dialog_id}`
    : `${ParamsKeyUser}/${user.username}`;

  return (
    <Link
      className="nav-link btn btn-link text-body p-0 m-1"
      to={`${linkParam}`}
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div className="card border-0 rounded-0 card-regular">
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div
              className={`avatar avatar-sm ${
                isOnline ? 'avatar-online' : ''
              } mr-3`}
            >
              {user.profile?.picture ? (
                <img
                  className="avatar-img"
                  src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${user.profile.picture}`}
                  alt={user.realname || user.username}
                />
              ) : (
                <IPerson fontSize="large" className="m-1 text-white" />
              )}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center">
                <h6 className="text-truncate mt-2 mb-0 pt-1 mr-auto">
                  {user.realname || <span>@{user.username}</span>}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardSearch;
