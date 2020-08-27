import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import SubMenu from './submenu';
import { MessageType } from '../../../../hooks/recoil/message';
import {
  UserNameType,
  userInfoQuery,
  instanceOfUser,
} from '../../../../hooks/recoil/user';
import Avatar from '../../components/avatar';
import { useRecoilValueLoadable } from 'recoil';

dayjs.extend(LocalizedFormat);

type MessageRightPropsType = {
  data: MessageType;
  iam: UserNameType;
};

const MessageRight = ({
  data: { created_at, body },
  iam: { username },
}: MessageRightPropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  return (
    <div className="message message-right">
      <div className="message-avatar ml-2 ml-lg-4 d-none d-lg-block">
        <Avatar
          pending={state === 'loading'}
          picture={instanceOfUser(contents) ? contents.profile.picture : ''}
          size="sm"
        />
      </div>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-center justify-content-end">
            <SubMenu leftSide />

            <div className="message-content">
              <h6 className="text-right text-primary">
                {state === 'hasValue' && instanceOfUser(contents)
                  ? contents.realname || <span>@{contents?.username}</span>
                  : '...'}
              </h6>
              <div className="alert alert-primary clearfix mb-0 py-1 px-lg-3 px-2">
                <div className="float-left text-break">{body}</div>
                <div className="float-right pl-2 pt-1 small">
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
};

export default MessageRight;
