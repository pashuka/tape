import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import SubMenu from './submenu';
import {
  MessageType,
  messageSelector,
  instanceOfMessage,
} from '../../../../hooks/recoil/message';
import {
  userInfoQuery,
  instanceOfUser,
  UserType,
} from '../../../../hooks/recoil/user';
import { useRecoilValueLoadable } from 'recoil';
import Avatar from '../../components/avatar';
import MessageReply from './messagereply';

dayjs.extend(LocalizedFormat);

type MessageLeftPropsType = {
  data: MessageType;
  isAdmin?: boolean;
};

const MessageLeft = ({
  data: { id, created_at, owner, body, reply_id },
  isAdmin,
}: MessageLeftPropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: owner }),
  );
  const { state: replyState, contents: replyContents } = useRecoilValueLoadable(
    messageSelector(reply_id),
  );
  const [member, setMember] = React.useState<UserType | undefined>();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    setMember(
      state === 'hasValue' && instanceOfUser(contents) ? contents : undefined,
    );
  }, [state, contents]);

  return (
    <div className="message mt-3 mt-md-4">
      <a className="mr-2 mr-lg-4" href="#dialog-member">
        <Avatar
          pending={state === 'loading'}
          picture={member?.profile?.picture}
          size="sm"
        />
      </a>

      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-end">
            <div className="message-content">
              <h6>
                {state === 'loading'
                  ? '@' + owner
                  : member
                  ? member.realname || <span>@{member.username}</span>
                  : null}
              </h6>
              <div
                className={`alert ${
                  isActive ? 'alert-dark' : 'bg-gray-100 border-gray-200'
                } clearfix mb-0 py-1 px-lg-3 px-2`}
              >
                {reply_id &&
                replyState === 'hasValue' &&
                instanceOfMessage(replyContents) ? (
                  <MessageReply reply={replyContents} />
                ) : null}
                <div className="text-body float-left text-break">{body}</div>
                <div className="float-right pl-2 pl-md-4 pt-1 small">
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
            <SubMenu
              message_id={id}
              handleOpen={setIsActive}
              isReplayable={true}
              isDeletable={isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageLeft;
