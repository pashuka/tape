import React, { Fragment } from 'react';
import { useRecoilValueLoadable } from 'recoil';

import { MessageSkeleton } from './message/skeleton';
import { messagesState } from '../../../hooks/recoil/message';
import Messages from './message';
import { UserType } from '../../../hooks/recoil/user';

type ContentPropsType = {
  iam: UserType;
};

const Content = ({ iam }: ContentPropsType) => {
  const refContentElement = React.createRef<HTMLDivElement>();
  const refLastElement = React.createRef<HTMLDivElement>();
  const { state, contents } = useRecoilValueLoadable(messagesState);

  React.useEffect(() => {
    refLastElement.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <div ref={refContentElement} className="chat-content px-2 px-lg-4">
      <div className="container-xxl py-2 py-lg-4">
        {state === 'loading' ? (
          <Fragment>
            <MessageSkeleton />
            <MessageSkeleton isIam />
            <MessageSkeleton />
            <MessageSkeleton isIam />
          </Fragment>
        ) : state === 'hasValue' && Array.isArray(contents) ? (
          <Messages messages={contents} iam={iam} />
        ) : null}
      </div>

      {/* Scroll to last message */}
      <div ref={refLastElement}></div>
    </div>
  );
};

export default Content;
