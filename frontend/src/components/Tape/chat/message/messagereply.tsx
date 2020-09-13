import React from 'react';
import { MessageType } from '../../../../hooks/recoil/message';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import { useRecoilValueLoadable } from 'recoil';

type MessageReplyPropsType = {
  reply: MessageType;
};

const MessageReply = ({ reply }: MessageReplyPropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: reply.owner }),
  );
  return (
    <div className="small border-left border-primary bg-white rounded px-2 my-1 mx-n2">
      <strong className="d-block">
        {state === 'hasValue' && instanceOfUser(contents)
          ? contents.realname || <span>@{contents?.username}</span>
          : '...'}
      </strong>
      {reply.body}
    </div>
  );
};

export default MessageReply;
