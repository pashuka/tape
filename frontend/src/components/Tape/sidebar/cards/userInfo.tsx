import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import IPerson from '@material-ui/icons/Person';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import {
  ParamsKeyUser,
  routes,
  QSParamsType,
  ParamsKeyDialog,
} from '../../../../constants';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import Skeleton from '../../../Skeleton';
import { ParticipantType } from '../../../../hooks/recoil/dialog';

type PropsType = {
  participant: ParticipantType;
};

const CardUserInfo = ({ participant }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery(participant.username),
  );

  return (
    <Link
      className="nav-link btn btn-link text-body p-0 m-1"
      to={
        participant.dialog_id
          ? `${participant.dialog_id}`
          : `${ParamsKeyUser}/${participant.username}`
      }
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          participant.dialog_id === params[ParamsKeyDialog]
            ? 'alert-primary'
            : 'card-regular'
        }`}
      >
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div className="avatar avatar-sm mr-3">
              {state === 'loading' && <Skeleton roundedCircle />}
              {state === 'hasValue' &&
                instanceOfUser(contents) &&
                (contents.profile?.picture ? (
                  <img
                    className="avatar-img"
                    src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${contents.profile?.picture}`}
                    alt={contents.realname || contents.username}
                  />
                ) : (
                  <IPerson fontSize="large" className="m-1 text-white" />
                ))}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center">
                <h6 className="text-truncate mt-2 mb-0 pt-1 mr-auto">
                  {state === 'loading' && <Skeleton width="128px" />}
                  {state === 'hasValue' &&
                    instanceOfUser(contents) &&
                    (contents.realname || (
                      <span>
                        <span className="text-gray-400">@</span>
                        {contents.username}
                      </span>
                    ))}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardUserInfo;
