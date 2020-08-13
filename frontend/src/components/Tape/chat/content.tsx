import React from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';

import {
  messagesState,
  messagesOffsetAtom,
  MessageType,
} from '../../../hooks/recoil/message';
import Messages from './message';
import { UserType } from '../../../hooks/recoil/user';
import Overlay from '../../Overlay';
import { limitFetchMax } from '../../../hooks/recoil/constants';

type ContentPropsType = {
  iam: UserType;
};

const Content = ({ iam }: ContentPropsType) => {
  const refLastElement = React.createRef<HTMLDivElement>();
  const refContentElement = React.createRef<HTMLDivElement>();
  const [scrollOnTop, setScrollOnTop] = React.useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = React.useState(0);

  const [offset, setOffset] = useRecoilState(messagesOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(messagesState);
  const [records, setRecords] = React.useState<MessageType[]>(
    [] as MessageType[],
  );

  React.useEffect(() => {
    if (refContentElement.current) {
      setPrevScrollHeight(refContentElement.current.scrollHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  React.useEffect(() => {
    if (offset === 0) {
      refLastElement.current?.scrollIntoView();
    } else if (records.length && refContentElement.current) {
      refContentElement.current?.scrollTo({
        left: 0,
        top: refContentElement.current.scrollHeight - prevScrollHeight,
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

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0) {
      setScrollOnTop(true);
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

      {/* Scroll to last message */}
      <div ref={refLastElement}></div>
    </div>
  );
};

export default Content;
