import React, { Fragment } from 'react';
import { useRecoilState } from 'recoil';

import { routes, host, apis } from '../../../constants';
import { MessageSkeleton } from './message/skeleton';
import { DialogType } from '../../../hooks/recoil/dialog';
import { useRecoilStore } from '../../../hooks/recoil/request';
import {
  MessagesAtom,
  MessagesType,
  MessageType,
} from '../../../hooks/recoil/message';
import Messages from './message';
import { UserType } from '../../../hooks/recoil/user';

type ContentPropsType = {
  iam: UserType;
  dialog: DialogType | undefined;
};

const Content = ({ iam, dialog }: ContentPropsType) => {
  const refContentElement = React.createRef<HTMLDivElement>();
  const refLastElement = React.createRef<HTMLDivElement>();
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  useRecoilStore<MessagesType>(
    MessagesAtom,
    dialog
      ? `${host}/${apis.version}/find/${routes.messages}/?dialog_id=${dialog.dialog_id}`
      : undefined,
  );
  const [{ isPending, data }] = useRecoilState(MessagesAtom);

  React.useEffect(() => {
    if (dialog && data && data[dialog.dialog_id]) {
      setMessages(data[dialog.dialog_id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dialog]);

  React.useEffect(() => {
    if (dialog && data && data[dialog.dialog_id]) {
      setMessages(data[dialog.dialog_id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dialog]);

  React.useEffect(() => {
    refLastElement.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <div ref={refContentElement} className="chat-content px-2 px-lg-4">
      <div className="container-xxl py-2 py-lg-4">
        {isPending ? (
          <Fragment>
            <MessageSkeleton />
            <MessageSkeleton isIam />
            <MessageSkeleton />
            <MessageSkeleton isIam />
          </Fragment>
        ) : (
          <Messages messages={messages} iam={iam} />
        )}
      </div>

      {/* Scroll to last message */}
      <div ref={refLastElement}></div>
    </div>
  );
};

export default Content;
