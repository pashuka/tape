import React from 'react';
import INotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import INotInterested from '@material-ui/icons/NotInterested';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

import CardWrapper from '../wrapper';
import {
  QSParamsType,
  ParamsKeyDialog,
  routes,
} from '../../../../../constants';
import { DialogType } from '../../../../../hooks/recoil/dialog';
import {
  instanceOfUser,
  userInfoQuery,
} from '../../../../../hooks/recoil/user';
import Avatar from '../../../components/avatar';
import { compactNumber } from '../../../../../utils';
import { useTranslation } from 'react-i18next';

dayjs.extend(isToday);

type PropsType = {
  dialog: DialogType;
};

const CardDialogGroup = ({ dialog }: PropsType) => {
  const { t } = useTranslation();
  const { params } = useRouteMatch<QSParamsType>();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username: dialog.last_message_owner }),
  );
  const dateString = dayjs(dialog.last_message_created_at).isToday()
    ? dayjs(dialog.last_message_created_at).format('HH:mm')
    : dayjs(dialog.last_message_created_at).format('ll');

  const active = dialog.id.toString() === params[ParamsKeyDialog];

  const title = dialog.profile.title;

  return (
    <CardWrapper
      active={active}
      to={`/${routes.tape}/${routes.dialogs}/${dialog.id}`}
    >
      <Avatar
        active={active}
        pending={state === 'loading'}
        picture={dialog.profile.picture}
        size="md"
        group={true}
      />

      <div className="media-body ml-2 overflow-hidden border-top">
        <div className="d-flex align-items-center pt-2">
          <h6 className="text-truncate mb-0 mr-auto">{title}</h6>
          {dateString && (
            <p className="small text-muted text-nowrap mb-2 ml-4">
              {dialog.settings.mute && (
                <INotificationsOffIcon
                  fontSize="small"
                  className={`mr-2 ${active ? 'text-white' : 'text-gray-300'}`}
                />
              )}
              {dateString}
            </p>
          )}
        </div>
        <div className="d-flex align-items-center pb-2">
          <div className="small text-muted text-truncate text-left mr-auto">
            {state === 'hasValue' && instanceOfUser(contents) ? (
              <div
                className={`badge badge-pill badge-info ${
                  active ? '' : 'bg-gray-400'
                } mr-1`}
                style={{ padding: '0.2em 0.4em' }}
              >
                {contents.realname || contents.username}
              </div>
            ) : null}
            {dialog.last_message_body === null ? (
              <small className="text-muted">
                <INotInterested style={{ fontSize: '1rem' }} />{' '}
                <i>{t('deleted')}</i>
              </small>
            ) : dialog.last_message_body.length ? (
              dialog.last_message_body
            ) : (
              <div className="badge badge-pill badge-light text-muted">
                {t('created')}
              </div>
            )}
          </div>
          {dialog.unread_count > 0 && (
            <div
              className={`badge badge-pill ${
                dialog.settings.mute
                  ? 'badge-secondary bg-gray-500'
                  : 'badge-primary'
              } ml-3`}
            >
              {compactNumber(dialog.unread_count)}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default CardDialogGroup;
