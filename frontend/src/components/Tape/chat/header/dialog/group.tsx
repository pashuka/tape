import React from 'react';
import INotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { DialogType } from '../../../../../hooks/recoil/dialog';
import Avatar from '../../../components/avatar';
import { useTranslation } from 'react-i18next';
import { compactNumber } from '../../../../../utils';

dayjs.extend(relativeTime);

type PropsType = {
  dialog: DialogType;
};

const HeaderDialogGroup = ({ dialog }: PropsType) => {
  const { t } = useTranslation();
  const title = dialog.profile.title;

  return (
    <div className="media text-center text-xl-left">
      <div className="d-none d-xl-inline-block text-center mr-3">
        <Avatar picture={dialog.profile.picture} size="sm" group={true} />
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
        <small className="text-muted">
          {compactNumber(dialog.member_count)} {t('members')}
        </small>
        <small className="text-muted px-2">•</small>
        {dialog.last_message_created_at && (
          <small className="text-muted">
            {t('last message')}{' '}
            {dayjs().to(new Date(dialog.last_message_created_at))}
          </small>
        )}
      </div>
    </div>
  );
};

export default HeaderDialogGroup;
