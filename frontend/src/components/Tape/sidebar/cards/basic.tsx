import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import ICancel from '@material-ui/icons/Cancel';

import { UserType, instanceOfUser } from '../../../../hooks/recoil/user';
import { DialogType, instanceOfDialog } from '../../../../hooks/recoil/dialog';
import Avatar, { iconSizeType } from '../../components/avatar';
import { routes } from '../../../../constants';
import CardWrapper from './wrapper';
import { MemberType } from '../../../../hooks/recoil/member';

dayjs.extend(isToday);

type PropsType = {
  active?: boolean;
  to?: string;
  avaSize?: iconSizeType;
  dialog?: DialogType;
  members?: UserType | UserType[] | MemberType[];
  lastMessageFrom?: UserType;
  isCancelable?: boolean;
};

const getMemberTitle = (m: UserType) =>
  m?.realname || <span>@{m?.username}</span>;

const getMemberAvatar = (
  m: UserType,
  active?: boolean,
  avaSize?: iconSizeType,
) => (
  <Avatar
    active={active}
    picture={m?.profile?.picture}
    realname={m?.realname}
    username={m?.username}
    size={avaSize || 'md'}
  />
);

const CardBasic = ({
  to,
  active,
  avaSize,
  dialog,
  members,
  lastMessageFrom,
  isCancelable,
}: PropsType) => {
  const date =
    instanceOfDialog(dialog) && new Date(dialog.last_message_created_at);
  const dateString =
    date &&
    (dayjs(date).isToday()
      ? dayjs(date).format('HH:mm')
      : dayjs(date).format('ll'));

  let title = null;
  let avatar = null;

  if (instanceOfUser(members)) {
    avatar = getMemberAvatar(members, active, avaSize);
    title = getMemberTitle(members);
  } else if (Array.isArray(members)) {
    if (dialog && dialog.dialog_type === 'group') {
      title = dialog.profile?.title;
      avatar = (
        <Avatar
          active={active}
          picture={dialog.profile?.picture}
          size={avaSize || 'md'}
          group={true}
        />
      );
    } else if (members.length === 1 && instanceOfUser(members[0])) {
      title = getMemberTitle(members[0]);
      avatar = getMemberAvatar(members[0], active, avaSize);
    }
  }

  return (
    <CardWrapper active={active} to={to || ''}>
      {avatar}

      <div className="media-body ml-2 overflow-hidden border-top">
        <div
          className={`d-flex align-items-center ${
            instanceOfDialog(dialog) ? 'pt-2' : 'my-2 py-2'
          }`}
        >
          <h6 className="text-truncate mb-0 mr-auto">{title}</h6>
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
              {dialog.last_message_body || '...'}
            </div>
            {/* <div className="badge badge-pill badge-primary ml-3">
                  {compactNumber(9)}
                </div> */}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default CardBasic;
