import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { DialogType } from '../../../../../hooks/recoil/dialog';
import Avatar from '../../../components/avatar';

dayjs.extend(relativeTime);

type PropsType = {
  dialog: DialogType;
};

const HeaderDialogGroup = ({ dialog }: PropsType) => {
  const title = dialog.profile.title;

  return (
    <div className="media text-center text-xl-left">
      <div className="d-none d-xl-inline-block text-center mr-3">
        <Avatar picture={dialog.profile.picture} size="md" group={true} />
      </div>
      <div className="media-body align-self-center text-truncate">
        <h6 className="text-truncate m-0">{title}</h6>
        {dialog.last_message_created_at && (
          <small className="text-muted">
            last message {dayjs().to(new Date(dialog.last_message_created_at))}
          </small>
        )}
      </div>
    </div>
  );
};

export default HeaderDialogGroup;
