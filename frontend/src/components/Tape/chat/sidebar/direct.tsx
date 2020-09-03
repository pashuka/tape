import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DialogType } from '../../../../hooks/recoil/dialog';
import { userInfoQuery, instanceOfUser } from '../../../../hooks/recoil/user';
import Skeleton from '../../../Skeleton';
import Avatar from '../../components/avatar';

dayjs.extend(relativeTime);

type PropsType = {
  dialog: DialogType;
  username: string;
};

const SideBarBodyDialogDirect = ({ dialog, username }: PropsType) => {
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  const title =
    state === 'loading' ? (
      <Skeleton width="128px" />
    ) : state === 'hasValue' && instanceOfUser(contents) ? (
      contents.realname || `@${contents.username}`
    ) : null;

  return (
    <div className="hide-scrollbar flex-fill bg-white">
      <div className="border-bottom text-center my-4 py-4">
        <Avatar
          pending={state === 'loading'}
          picture={
            state === 'hasValue' && instanceOfUser(contents)
              ? contents.profile.picture
              : ''
          }
          size="lg"
        />
        <h5 className="pt-4">{title}</h5>
        {state === 'hasValue' &&
          instanceOfUser(contents) &&
          contents.profile.status && (
            <p className="text-muted">{contents.profile.status}</p>
          )}
      </div>
    </div>
  );
};

export default SideBarBodyDialogDirect;
