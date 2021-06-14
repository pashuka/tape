import React from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';

import {
  messagesState,
  messagesOffsetAtom,
  MessageType,
  lastReadMessage,
  instanceOfMessage,
} from '../../../hooks/recoil/message';
import Messages from './message';
import { UserNameType } from '../../../hooks/recoil/user';
import Overlay from '../../Overlay';
import { limitFetchMax } from '../../../hooks/recoil/constants';
import { useFetch } from 'react-async';
import { getRoute, routes } from '../../../constants';
import { DialogType } from '../../../hooks/recoil/dialog';
import { MemberType } from '../../../hooks/recoil/member';

type ContentPropsType = {
  iam: UserNameType;
  dialog: DialogType | undefined;
};

const Content = ({ iam, dialog }: ContentPropsType) => {
  const refContentElement = React.createRef<HTMLDivElement>();
  const [scrollOnTop, setScrollOnTop] = React.useState(false);
  const [prevOffset, setPrevOffset] = React.useState(0);

  const [offset, setOffset] = useRecoilState(messagesOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(messagesState);
  const { state: lastMessageState, contents: lastMessageContents } =
    useRecoilValueLoadable(lastReadMessage);
  const [records, setRecords] = React.useState<MessageType[]>(
    [] as MessageType[],
  );

  const { run: readMessage } = useFetch<MemberType>(
    getRoute(`put/${routes.dialogs}/`),
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );

  React.useEffect(() => {
    if (!refContentElement.current) return;
    const el = refContentElement.current;
    if (offset === 0) {
      el.scrollTop = el.scrollHeight;
    } else if (records.length) {
      el.scrollTo({
        left: 0,
        top: el.scrollHeight - prevOffset,
        behavior: 'auto',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  React.useEffect(() => {
    if (scrollOnTop && offset + limitFetchMax === records.length) {
      setOffset((currVal: number) => currVal + limitFetchMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollOnTop]);

  React.useEffect(() => {
    if (state === 'hasValue' && Array.isArray(contents)) {
      setRecords(contents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, contents]);

  React.useEffect(() => {
    if (prevOffset) {
      setScrollOnTop(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevOffset]);

  React.useEffect(() => {
    if (
      lastMessageState === 'hasValue' &&
      instanceOfMessage(lastMessageContents) &&
      lastMessageContents.dialog_id === dialog?.id
    ) {
      if (dialog?.unread_count && dialog.unread_count > 0) {
        readMessage({
          resource: getRoute(`put/${routes.dialogs}/?dialog_id=${dialog.id}`),
          method: 'PUT',
          body: JSON.stringify({
            read_message_id: lastMessageContents.id,
          }),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageState, lastMessageContents, dialog]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    // here we check current scroll offset at the top of chat content element screen
    // if we check it for zero then we should fetch messages only if we scroll at the
    // top of the screen, try to load messages little bit earlier
    if (el.scrollTop === 0) {
      setPrevOffset(el.scrollHeight);
    } else {
      setScrollOnTop(false);
    }
  };

  return (
    <div
      ref={refContentElement}
      className="chat-content px-2 px-lg-4"
      onScroll={handleScroll}
    >
      <div className="py-2 py-lg-4">
        <div
          className={`d-flex justify-content-center p-2 ${
            state === 'loading' ? 'show' : 'fade'
          }`}
        >
          <Overlay size="sm" badge={true} />
        </div>
        <Messages messages={records} iam={iam} />
      </div>
    </div>
  );
};

export default Content;
