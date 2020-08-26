import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import SubMenu from './submenu';
import { MessageType } from '../../../../hooks/recoil/message';
import {
  userInfoQuery,
  instanceOfUser,
  UserType,
} from '../../../../hooks/recoil/user';
import { useRecoilValueLoadable } from 'recoil';
import Avatar from '../../components/avatar';

dayjs.extend(LocalizedFormat);

type MessageLeftPropsType = {
  data: MessageType;
};

const MessageLeft = ({
  data: { created_at, owner, body },
}: MessageLeftPropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: owner }),
  );
  const [member, setMember] = React.useState<UserType | undefined>();

  React.useEffect(() => {
    setMember(
      state === 'hasValue' && instanceOfUser(contents) ? contents : undefined,
    );
  }, [state, contents]);

  return (
    <div className="message">
      <a className="mr-2 mr-lg-4" href="#chat-messages">
        <Avatar
          pending={state === 'loading'}
          picture={member?.profile?.picture}
          size="sm"
        />
      </a>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-center">
            <div className="message-content">
              <h6>
                {state === 'loading'
                  ? '@' + owner
                  : member
                  ? member.realname || <span>@{member.username}</span>
                  : null}
              </h6>
              <div className="alert bg-gray-100 border-gray-200 mb-0 py-1 py-lg-2 px-lg-3 px-2">
                <div className="float-right small">
                  <small
                    className="text-gray-600"
                    style={{ lineHeight: 1 }}
                    title={dayjs(new Date(created_at)).format('lll')}
                  >
                    {dayjs(new Date(created_at)).format('HH:mm')}
                  </small>
                </div>
                <div className="text-body">{body}</div>
              </div>
            </div>
            <SubMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageLeft;
