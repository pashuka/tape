import React from 'react';
import INotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import { useRecoilValueLoadable } from 'recoil';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DialogType } from '../../../../../hooks/recoil/dialog';
import {
  instanceOfUser,
  userInfoQuery,
} from '../../../../../hooks/recoil/user';
import Avatar from '../../../components/avatar';
import Skeleton from '../../../../Skeleton';

dayjs.extend(relativeTime);

type PropsType = {
  dialog: DialogType;
  username: string;
};

const HeaderDialogDirect = ({ dialog, username }: PropsType) => {
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
    <div className="media text-center text-xl-left">
      <div className="d-none d-xl-inline-block text-center mr-3">
        <Avatar
          pending={state === 'loading'}
          picture={instanceOfUser(contents) ? contents.profile.picture : ''}
          size="sm"
        />
      </div>
      <div className="media-body align-self-center text-truncate">
        <h6 className="text-truncate m-0">
          {dialog.settings.mute && (
            <INotificationsOffIcon
              fontSize="small"
              className="mr-2 text-gray-300"
            />
          )}
          {title}
        </h6>
        {dialog.last_message_created_at && (
          <small className="text-muted">
            last message {dayjs().to(new Date(dialog.last_message_created_at))}
          </small>
        )}
      </div>
    </div>
  );
};

export default HeaderDialogDirect;
