import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import { Link } from 'react-router-dom';
import { routes } from '../../../../constants';
import Skeleton from '../../../Skeleton';
import { DialogType, DialogsState } from '../../../../hooks/recoil/dialog';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import {
  UserType,
  userInfoQuery,
  instanceOfUser,
} from '../../../../hooks/recoil/user';
import DialogHeader from './dialog';
import UserHeader from './user';
import SideBar from './sidebar';
import { useRecoilValue } from 'recoil';
import Avatar from '../../components/avatar';

dayjs.extend(relativeTime);

declare type HeaderPropsType = {
  dialog?: DialogType;
  iam: UserType;
  user?: string;
};

// TODO: split dialog header into user/group headers
const Header = ({ dialog, iam, user }: HeaderPropsType) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const { state } = useRecoilValueLoadable(DialogsState);

  let participantName: string | undefined;
  if (user) {
    participantName = user;
  } else if (dialog) {
    participantName = dialog?.participants.find((_) => _ !== iam?.username);
  }
  const participant = useRecoilValue(userInfoQuery(participantName));

  return (
    <div className="chat-header bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="container-xxl">
        <div className="row align-items-center">
          <div className="col-2 d-xl-none">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/${routes.tape}/${routes.dialogs}/`}
                  className="text-muted px-0"
                  onClick={(e) => {
                    // e.preventDefault();
                    setMessenger({
                      isOpen: messenger.isOpen,
                      isChatOpen: false,
                    });
                  }}
                >
                  <IChevronLeft />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-8 col-xl-8">
            <div className="media text-center text-xl-left">
              <div className="d-none d-xl-inline-block text-center mr-3">
                {state === 'loading' && <Skeleton roundedCircle />}
                {state === 'hasValue' && instanceOfUser(participant) && (
                  <Avatar
                    picture={participant.profile?.picture}
                    realname={participant.realname}
                    username={participant.username}
                    size="md"
                  />
                )}
              </div>
              {state === 'loading' && (
                <div className="media-body align-self-center text-truncate">
                  <h6 className="mb-1">
                    <Skeleton width="128px" />
                  </h6>
                  <small>
                    <Skeleton width="256px" />
                  </small>
                </div>
              )}
              {user ? (
                <UserHeader participant={participant} />
              ) : (
                dialog && (
                  <DialogHeader dialog={dialog} participant={participant} />
                )
              )}
            </div>
          </div>
          <SideBar isPending={state === 'loading' || true} />
        </div>
      </div>
    </div>
  );
};

export default Header;
