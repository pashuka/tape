import React from "react";
import { useRecoilState } from "recoil";

import { MessageType } from "../../../../hooks/recoil/message";
import { UserType, UsersAtom } from "../../../../hooks/recoil/user";
import MessageRight from "./messageright";
import MessageLeft from "./messageleft";
import Day from "../day";

type PropsType = {
  messages: MessageType[];
  iam: UserType;
};

const Messages = ({ messages, iam }: PropsType) => {
  const [{ data: users }] = useRecoilState(UsersAtom);
  let prevDay: string;
  return (
    <React.Fragment>
      {messages.map((_, index) => {
        const { owner, created_at } = _;
        const message =
          iam.username === owner ? (
            <MessageRight user={iam} data={_} />
          ) : (
            <MessageLeft user={users?.find(({ username }) => username === owner)} data={_} />
          );
        const day = <Day createdAt={created_at} prevDay={prevDay} />;
        prevDay = created_at;
        return (
          <React.Fragment key={index}>
            {day}
            {message}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default Messages;
