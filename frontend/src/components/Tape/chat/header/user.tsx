import React from 'react';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilValueLoadable } from 'recoil';

dayjs.extend(relativeTime);

declare type PropsType = {
  username: string;
};

const DialogHeader = ({ username }: PropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  return (
    <div className="media-body align-self-center text-truncate">
      <h6 className="text-truncate mt-2">
        {state === 'hasValue' && contents && instanceOfUser(contents)
          ? contents.realname || `@${contents.username}`
          : null}
      </h6>
    </div>
  );
};
export default DialogHeader;
