import React from 'react';

import { MessageType } from '../../../../hooks/recoil/message';
import { UserNameType } from '../../../../hooks/recoil/user';
import MessageRight from './messageright';
import MessageLeft from './messageleft';
import Day from '../day';

type PropsType = {
  messages: MessageType[];
  iam: UserNameType;
};

const Messages = ({ messages, iam }: PropsType) => {
  let prevDay: string;
  return (
    <React.Fragment>
      {messages.map((_, index) => {
        const { owner, created_at } = _;
        const message =
          iam.username === owner ? (
            <MessageRight iam={iam} data={_} />
          ) : (
            <MessageLeft data={_} isAdmin={false} />
          );
        prevDay = created_at;
        return (
          <React.Fragment key={`message-${_.id}`}>
            <Day isSticky={true} createdAt={created_at} prevDay={prevDay} />
            {message}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default Messages;
