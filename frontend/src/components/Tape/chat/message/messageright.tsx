import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import SubMenu from './submenu';
import { MessageType } from '../../../../hooks/recoil/message';
import { UserType } from '../../../../hooks/recoil/user';
import Avatar from '../../components/avatar';

dayjs.extend(LocalizedFormat);

type MessageRightPropsType = {
  data: MessageType;
  user: UserType;
};

const MessageRight = ({
  data: { created_at, body },
  user,
}: MessageRightPropsType) => (
  <div className="message message-right">
    <div className="message-avatar ml-2 ml-lg-4 d-none d-lg-block">
      <Avatar
        picture={user.profile?.picture}
        realname={user.realname}
        username={user.username}
        size="sm"
      />
    </div>

    <div className="message-body">
      <div className="message-row">
        <div className="d-flex align-items-center justify-content-end">
          <SubMenu leftSide />

          <div className="message-content">
            <h6 className="text-right text-primary">
              {user?.realname || <span>@{user?.username}</span>}
            </h6>
            <div className="alert alert-primary mb-0 py-1 py-lg-2 px-lg-3 px-2">
              <div className="text-break">{body}</div>

              <div className="text-right small">
                <small
                  className="text-gray-600"
                  style={{ lineHeight: 1 }}
                  title={dayjs(new Date(created_at)).format('lll')}
                >
                  {dayjs(new Date(created_at)).format('HH:mm')}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MessageRight;
