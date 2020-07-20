import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import IPerson from '@material-ui/icons/Person';

import SubMenu from './submenu';
import { routes } from '../../../../constants';
import { MessageType } from '../../../../hooks/recoil/message';
import { UserType } from '../../../../hooks/recoil/user';

dayjs.extend(LocalizedFormat);

type MessageLeftPropsType = {
  data: MessageType;
  user?: UserType;
};

const MessageLeft = ({
  data: { created_at, owner, body },
  user,
}: MessageLeftPropsType) => (
  <div className="message">
    <a className="avatar avatar-sm mr-2 mr-lg-5" href="#chat-messages">
      {user?.profile && user.profile?.picture ? (
        <img
          className="avatar-img"
          src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${user.profile.picture}`}
          alt=""
        />
      ) : (
        <IPerson fontSize="large" className="m-1 text-white" />
      )}
    </a>

    <div className="message-body">
      <div className="message-row">
        <div className="d-flex align-items-center">
          <div className="alert message-content bg-gray-100 border-gray-200 mb-0 py-1 py-lg-2 px-lg-3 px-2">
            <h6 className="mt-1 mb-1">{owner}</h6>
            <div className="text-body">{body}</div>

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
          <SubMenu />
        </div>
      </div>
    </div>
  </div>
);

export default MessageLeft;
