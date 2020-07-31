import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import ICancel from '@material-ui/icons/Cancel';

import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { UserType, instanceOfUser } from '../../../../hooks/recoil/user';
import { DialogType, instanceOfDialog } from '../../../../hooks/recoil/dialog';
import Avatar, { iconSizeType } from '../../components/avatar';
import { routes } from '../../../../constants';

dayjs.extend(isToday);

type PropsType = {
  active?: boolean;
  to?: string;
  avaSize?: iconSizeType;
  dialog?: DialogType;
  member?: UserType;
  isCancelable?: boolean;
};

const CardBasic = ({
  to,
  active,
  avaSize,
  dialog,
  member,
  isCancelable,
}: PropsType) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const date =
    instanceOfDialog(dialog) && new Date(dialog.last_message_created_at);
  const dateString =
    date &&
    (dayjs(date).isToday()
      ? dayjs(date).format('HH:mm')
      : dayjs(date).format('ll'));
  return (
    <Link
      className="nav-link text-body p-0"
      to={to || ''}
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          active ? 'alert-primary' : 'card-regular'
        }`}
      >
        <div className="card-body p-0 px-2">
          <div className="media d-flex align-items-center justify-content-center">
            {instanceOfUser(member) && (
              <Avatar
                active={active}
                picture={member.profile?.picture}
                realname={member.realname}
                username={member.username}
                size={avaSize || 'md'}
              />
            )}

            <div className="media-body overflow-hidden border-top">
              <div
                className={`d-flex align-items-center ${
                  instanceOfDialog(dialog) ? 'pt-2' : 'py-2 my-2'
                }`}
              >
                <h6 className="text-truncate mb-0 mr-auto">
                  {member?.realname || <span>@{member?.username}</span>}
                </h6>
                {isCancelable && (
                  <Link
                    className="btn btn-link text-gray-400 text-nowrap"
                    to={`/${routes.tape}/${routes.dialogs}/`}
                  >
                    <ICancel />
                  </Link>
                )}
                {dateString && (
                  <p className="small text-muted text-nowrap mb-2 ml-4">
                    {dateString}
                  </p>
                )}
              </div>
              {instanceOfDialog(dialog) && (
                <div className="d-flex align-items-center pb-2">
                  <div className="small text-muted text-truncate text-left mr-auto">
                    {dialog.last_message_body}
                  </div>
                  {/* <div className="badge badge-pill badge-primary ml-3">
                  {compactNumber(9)}
                </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardBasic;
