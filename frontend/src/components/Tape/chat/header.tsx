import React from 'react';
import ISearch from '@material-ui/icons/Search';
import IPersonAdd from '@material-ui/icons/PersonAdd';
import IPerson from '@material-ui/icons/Person';
// import IPeople from "@material-ui/icons/People";
import IMoreVert from '@material-ui/icons/MoreVert';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilState } from 'recoil';

import { Link, useRouteMatch } from 'react-router-dom';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
  routes,
  host,
  apis,
} from '../../../constants';
import Skeleton from '../../Skeleton';
import { useFetch } from 'react-async';
import { AuthAtom } from '../../../hooks/recoil/auth';
import { DialogsAtom, DialogType } from '../../../hooks/recoil/dialog';
import { MessengerAtom } from '../../../hooks/recoil/messenger';
import { UsersAtom, UserType } from '../../../hooks/recoil/user';

dayjs.extend(relativeTime);

// TODO: split dialog header into user/group headers
const Header = () => {
  const { params } = useRouteMatch<QSParamsType>();
  const [{ data: iam }] = useRecoilState(AuthAtom);
  const [{ data: users }] = useRecoilState(UsersAtom);
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const [{ isPending, data: dialogs }] = useRecoilState(DialogsAtom);

  const [dialog, setDialog] = React.useState<DialogType | undefined>();
  const [participant, setParticipant] = React.useState<UserType | undefined>();

  const { data, isPending: isPendingFetchUser, run } = useFetch<UserType>(
    `${host}/${apis.version}/get/${routes.user}/?username=`,
    { headers: { accept: 'application/json' } },
    { defer: true },
  );

  React.useEffect(() => {
    if (!isPendingFetchUser && data) {
      setParticipant(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPendingFetchUser, data]);

  React.useEffect(() => {
    if (dialogs && dialogs.length > 0 && params[ParamsKeyUser]) {
      const record = dialogs?.find(
        ({ dialog_id }) => dialog_id === params[ParamsKeyUser],
      );
      setDialog(record);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogs]);

  React.useEffect(() => {
    if (users) {
      let participantUserName: string | undefined;
      if (params[ParamsKeyUser]) {
        participantUserName = params[ParamsKeyUser];
      } else if (params[ParamsKeyDialog]) {
        participantUserName = dialog?.participants.find(
          (_) => _ !== iam?.username,
        );
      }
      const record = users.find(
        ({ username }) => username === participantUserName,
      );
      if (record) {
        setParticipant(record);
      } else if (!isPendingFetchUser) {
        run({
          resource: `${host}/${apis.version}/get/${routes.user}/?username=${participantUserName}`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, users]);

  return (
    <div className="chat-header bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="container-xxl">
        <div className="row align-items-center">
          <div className="col-2 d-xl-none">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/${routes.dialogs}/`}
                  className="text-muted px-0"
                  onClick={(e) => {
                    // e.preventDefault();
                    setMessenger({
                      isOpen: messenger.isOpen,
                      isChatOpen: false,
                    });
                  }}
                >
                  <IChevronLeft />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-8 col-xl-8">
            <div className="media text-center text-xl-left">
              <div className="avatar avatar-sm d-none d-xl-inline-block mr-3 text-center">
                {isPending ? (
                  <Skeleton rounded />
                ) : participant?.profile?.picture ? (
                  <img
                    className="avatar-img"
                    src={`${process.env.REACT_APP_IMG_HOST}/${routes.user}/thumb-${participant.profile.picture}`}
                    alt="Participant"
                  />
                ) : (
                  <IPerson fontSize="large" className="m-1 text-white" />
                )}
              </div>
              {isPending && (
                <div className="media-body align-self-center text-truncate">
                  <h6 className="mb-1">
                    <Skeleton width="128px" />
                  </h6>
                  <small>
                    <Skeleton width="256px" />
                  </small>
                </div>
              )}
              {dialog && (
                <div className="media-body align-self-center text-truncate">
                  <h6 className="text-truncate mb-n1">
                    {dialog?.profile?.title ||
                      // dialog.participants.filter((_) => _ !== iam?.username).join(", ")
                      participant?.realname ||
                      participant?.username}
                  </h6>
                  {dialog.participants.length > 2 && (
                    <small className="text-muted">
                      {dialog.participants.length} members
                    </small>
                  )}
                  {/* {dialog.description && <small className="text-muted mx-2"> • </small>} */}
                  {/* {dialog.description && <small className="text-muted">{dialog.description}</small>} */}
                  {dialog.participants.length > 2 && (
                    <small className="text-muted mx-2"> • </small>
                  )}
                  {dialog.last_message_created_at && (
                    <small className="text-muted">
                      last message{' '}
                      {dayjs().to(new Date(dialog.last_message_created_at))}
                    </small>
                  )}
                </div>
              )}
              {/* <div className="media-body align-self-center text-truncate">
                <h6 className="text-truncate mb-n1">
                  {participant?.realname || participant?.username}
                </h6>
              </div> */}
            </div>
          </div>

          <div className="col-2 col-xl-4 text-right">
            <ul className="nav justify-content-end">
              <li className="nav-item list-inline-item d-none d-xl-block mr-2">
                <button
                  className="nav-link btn btn-link text-muted px-3"
                  title="Search this chat"
                  type="button"
                  disabled={isPending || true}
                >
                  <ISearch />
                </button>
              </li>

              <li className="nav-item list-inline-item d-none d-xl-block mr-2">
                <button
                  className="nav-link btn btn-link text-muted px-3"
                  title="Add People"
                  type="button"
                  disabled={isPending || true}
                >
                  <IPersonAdd />
                </button>
              </li>

              <li className="nav-item list-inline-item d-none d-xl-block mr-0">
                <button
                  type="button"
                  disabled={isPending || true}
                  className="nav-link btn btn-link text-muted px-3"
                  title="Details"
                >
                  <IMoreVert />
                </button>
              </li>

              <li className="nav-item list-inline-item d-block d-xl-none">
                <div className="dropdown">
                  <button
                    className="nav-link btn btn-link text-muted px-0"
                    type="button"
                    disabled={isPending || true}
                  >
                    <IMoreVert />
                  </button>
                  <div className="dropdown-menu">
                    <a
                      className="dropdown-item d-flex align-items-center"
                      data-toggle="collapse"
                      data-target="#chat-1-search"
                      href="#chat-search"
                    >
                      Search <ISearch />
                    </a>

                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#chat-info"
                      data-chat-sidebar-toggle="#chat-1-info"
                    >
                      Chat Info{' '}
                      <span className="ml-auto pl-5 fe-more-horizontal"></span>
                    </a>

                    <button
                      className="dropdown-item d-flex align-items-center"
                      disabled={isPending || true}
                    >
                      Add Members <IPersonAdd />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
