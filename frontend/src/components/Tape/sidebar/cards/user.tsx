import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import IPerson from '@material-ui/icons/Person';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  ParamsKeyUser,
  routes,
  QSParamsType,
  ParamsKeyDialog,
} from '../../../../constants';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { UserType } from '../../../../hooks/recoil/user';
import { dialogParticipant } from '../../../../hooks/recoil/dialog';

type PropsType = {
  participant: UserType;
};

const CardUser = ({ participant }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const dialog = useRecoilValue(dialogParticipant(participant.username));

  return (
    <Link
      className="nav-link btn btn-link text-body p-0 m-1"
      to={
        dialog
          ? `${dialog.dialog_id}`
          : `${ParamsKeyUser}/${participant.username}`
      }
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          dialog && dialog.dialog_id === params[ParamsKeyDialog]
            ? 'alert-primary'
            : 'card-regular'
        }`}
      >
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div className="avatar avatar-sm mr-3">
              {participant.profile?.picture ? (
                <img
                  className="avatar-img"
                  src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant.profile?.picture}`}
                  alt={participant.realname || participant.username}
                />
              ) : (
                <IPerson fontSize="large" className="m-1 text-white" />
              )}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center">
                <h6 className="text-truncate mt-2 mb-0 pt-1 mr-auto">
                  {participant.realname || (
                    <span>
                      <span className="text-gray-400">@</span>
                      {participant.username}
                    </span>
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardUser;
