import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import dayjs from 'dayjs';
import IPerson from '@material-ui/icons/Person';
import { useRecoilState } from 'recoil';

import isToday from 'dayjs/plugin/isToday';
import {
  QSParamsType,
  ParamsKeyDialog,
  routes,
  apis,
  host,
} from '../../../../constants';
import { useFetch } from 'react-async';
import { AuthAtom } from '../../../../hooks/recoil/auth';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import { UsersAtom, UserType } from '../../../../hooks/recoil/user';
import { DialogType } from '../../../../hooks/recoil/dialog';
// import { compactNumber } from '../../../../utils';

dayjs.extend(isToday);

type DialogPropsType = {
  dialog?: DialogType;
};

const Dialog = ({ dialog }: DialogPropsType) => {
  const isOnline = false;
  const date = dialog ? new Date(dialog?.last_message_created_at) : '';
  const [participant, setParticipant] = React.useState<UserType | undefined>();
  const { params } = useRouteMatch<QSParamsType>();
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const [{ data: iam }] = useRecoilState(AuthAtom);
  const [users, setUsers] = useRecoilState(UsersAtom);

  const currentParticipant = dialog?.participants.find(
    (_) => _ !== iam?.username,
  );

  const { data, run } = useFetch<UserType>(
    `${host}/${apis.version}/get/${routes.user}/?username=`,
    { headers: { accept: 'application/json' } },
    { defer: true },
  );

  React.useEffect(() => {
    if (currentParticipant) {
      const record = users.data?.find(
        ({ username }) => username === currentParticipant,
      );
      if (record) {
        setParticipant(record);
      } else {
        run({
          resource: `${host}/${apis.version}/get/${routes.user}/?username=${currentParticipant}`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (data && data.username === currentParticipant) {
      setUsers((prev) =>
        prev.data ? { ...prev, data: [...prev.data, data] } : prev,
      );
      setParticipant(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  let sDate;
  if (dayjs(date).isToday()) {
    sDate = dayjs(date).format('HH:mm');
    // } else if {
    //   sDate = dayjs(date).format("ddd");
  } else {
    sDate = dayjs(date).format('ll');
  }
  return (
    <Link
      className="nav-link text-body p-0 border-bottom m-2"
      to={`/${routes.dialogs}/${dialog?.dialog_id}/`}
      onClick={(e) => {
        setMessenger({ isOpen: messenger.isOpen, isChatOpen: true });
      }}
    >
      <div
        className={`card border-0 rounded-0 ${
          dialog?.dialog_id === params[ParamsKeyDialog]
            ? 'alert-primary'
            : 'card-regular'
        }`}
      >
        <div className="card-body py-2 py-lg-2">
          <div className="media">
            <div
              className={`avatar ${
                isOnline ? 'avatar-online' : ''
              } mt-2 mb-2 mr-3`}
            >
              {participant?.profile?.picture ? (
                <img
                  className="avatar-img"
                  src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant?.profile?.picture}`}
                  alt={participant?.realname || participant?.username}
                />
              ) : (
                <IPerson fontSize="large" className="ml-2 mt-2 text-white" />
              )}
              {/* <IAccountCircle /> */}
            </div>

            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center">
                <h6 className="text-truncate mb-0 mr-auto">
                  {participant?.realname || participant?.username}
                </h6>
                <p className="small text-muted text-nowrap ml-4">{sDate}</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-muted text-truncate text-left mr-auto">
                  {dialog?.last_message_body}
                </div>
                {/* <div className="badge badge-pill badge-primary ml-3">
                  {compactNumber(9)}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Dialog;
