import React from 'react';
import INotificationsOffIcon from '@material-ui/icons/NotificationsOff';
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
  UserType,
} from '../../../../../hooks/recoil/user';
import Avatar from '../../../components/avatar';
import Skeleton from '../../../../Skeleton';
import { compactNumber } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import { MemberType } from '../../../../../hooks/recoil/member';
// import Typing from '../../../components/typing';

dayjs.extend(isToday);

type PropsType = {
  dialog: DialogType;
  username: string;
};

const CardDialogDirect = ({ dialog, username }: PropsType) => {
  const { t } = useTranslation();
  const { params } = useRouteMatch<QSParamsType>();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );
  const [member, setMember] = React.useState<
    UserType | MemberType | undefined
  >();
  React.useEffect(() => {
    if (state === 'hasValue' && instanceOfUser(contents)) {
      setMember(contents);
    }
  }, [state, contents]);

  // const [isTyping, setIsTyping] = React.useState(false);
  // React.useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsTyping(false);
  //   }, 2000);
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, []);

  const dateString = dayjs(dialog.last_message_created_at).isToday()
    ? dayjs(dialog.last_message_created_at).format('HH:mm')
    : dayjs(dialog.last_message_created_at).format('ll');

  const active = dialog.id.toString() === params[ParamsKeyDialog];

  const title =
    state === 'loading' ? <Skeleton width="128px" /> : member?.realname;

  return (
    <CardWrapper
      active={active}
      to={`/${routes.tape}/${routes.dialogs}/${dialog.id}`}
    >
      <Avatar
        active={active}
        pending={state === 'loading'}
        picture={member?.profile?.picture}
        size="md"
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
            {/* {isTyping ? <Typing /> : dialog.last_message_body} */}
            {member && dialog.last_message_owner !== member.username
              ? t('You') + ': '
              : null}
            {dialog.last_message_body}
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

export default CardDialogDirect;
