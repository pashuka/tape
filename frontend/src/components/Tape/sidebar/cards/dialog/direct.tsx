import React from 'react';
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
import Skeleton from '../../../../Skeleton';
import { compactNumber } from '../../../../../utils';
// import Typing from '../../../components/typing';

dayjs.extend(isToday);

type PropsType = {
  dialog: DialogType;
  username: string;
};

const CardDialogDirect = ({ dialog, username }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const { state, contents } = useRecoilValueLoadable(
    userInfoQuery({ username }),
  );

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
    state === 'loading' ? (
      <Skeleton width="128px" />
    ) : state === 'hasValue' && instanceOfUser(contents) ? (
      contents.realname
    ) : (
      'REALUSERNAME'
    );

  return (
    <CardWrapper
      active={active}
      to={`/${routes.tape}/${routes.dialogs}/${dialog.id}`}
    >
      <Avatar
        active={active}
        pending={state === 'loading'}
        picture={instanceOfUser(contents) ? contents.profile?.picture : ''}
        size="md"
      />

      <div className="media-body ml-2 overflow-hidden border-top">
        <div className="d-flex align-items-center pt-2">
          <h6 className="text-truncate mb-0 mr-auto">{title}</h6>
          {dateString && (
            <p className="small text-muted text-nowrap mb-2 ml-4">
              {dateString}
            </p>
          )}
        </div>
        <div className="d-flex align-items-center pb-2">
          <div className="small text-muted text-truncate text-left mr-auto">
            {/* {isTyping ? <Typing /> : dialog.last_message_body} */}
            {dialog.last_message_body}
          </div>
          {dialog.unread_count > 0 && (
            <div className="badge badge-pill badge-primary ml-3">
              {compactNumber(dialog.unread_count)}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default CardDialogDirect;
