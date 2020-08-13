import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import { messagesState } from '../../../hooks/recoil/message';
import Messages from './message';
import { UserType } from '../../../hooks/recoil/user';
import Overlay from '../../Overlay';

type ContentPropsType = {
  iam: UserType;
};

const Content = ({ iam }: ContentPropsType) => {
  const refLastElement = React.createRef<HTMLDivElement>();
  const { state, contents } = useRecoilValueLoadable(messagesState);

  React.useEffect(() => {
    refLastElement.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if (state === 'loading') {
    return (
      <div className="chat-content px-2 px-lg-4 d-flex justify-content-center">
        <Overlay size="sm" />
      </div>
    );
  }

  return (
    <div className="chat-content px-2 px-lg-4">
      <div className="py-2 py-lg-4">
        {state === 'hasValue' && Array.isArray(contents) ? (
          <Messages messages={contents} iam={iam} />
        ) : null}
      </div>

      {/* Scroll to last message */}
      <div ref={refLastElement}></div>
    </div>
  );
};

export default Content;
