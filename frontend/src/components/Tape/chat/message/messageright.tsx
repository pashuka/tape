import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import IPerson from '@material-ui/icons/Person';
import { routes } from '../../../../constants';
import SubMenu from './submenu';
import { MessageType } from '../../../../hooks/recoil/message';
import { UserType } from '../../../../hooks/recoil/user';

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
    <div className="avatar avatar-sm ml-2 ml-lg-5 d-none d-lg-block">
      {user.profile?.picture ? (
        <img
          className="avatar-img"
          src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${user.profile.picture}`}
          alt=""
        />
      ) : (
        <IPerson fontSize="large" className="m-1 text-white" />
      )}
    </div>

    <div className="message-body">
      <div className="message-row">
        <div className="d-flex align-items-center justify-content-end">
          <SubMenu leftSide />
          <div className="alert alert-primary message-content mb-0 py-1 py-lg-2 px-lg-3 px-2">
            <div className="">{body}</div>

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
);

export default MessageRight;
