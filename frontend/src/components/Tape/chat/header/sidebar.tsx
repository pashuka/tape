import React from 'react';

import ISearch from '@material-ui/icons/Search';
import IPersonAdd from '@material-ui/icons/PersonAdd';
import IMoreVert from '@material-ui/icons/MoreVert';
import INotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import INotificationsOffOutlined from '@material-ui/icons/NotificationsOffOutlined';
import { useSetRecoilState } from 'recoil';
import {
  MessengerAtom,
  MessengerType,
} from '../../../../hooks/recoil/messenger';
import { DialogType } from '../../../../hooks/recoil/dialog';
import { routes, getRoute } from '../../../../constants';
import { MemberType } from '../../../../hooks/recoil/member';
import { useFetch } from 'react-async';

declare type PropsType = {
  dialog: DialogType;
  disabled?: boolean;
};

const SideBar = ({ dialog, disabled = false }: PropsType) => {
  const setMessenger = useSetRecoilState(MessengerAtom);
  const { run } = useFetch<MemberType>(
    getRoute(`put/${routes.dialogs}/`),
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );
  return (
    <div className="col-2 col-xl-6 text-right">
      <ul className="nav justify-content-end">
        {/* <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title="Search this chat"
            type="button"
            disabled={disabled}
          >
            <ISearch />
          </button>
        </li> */}

        {/* <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title="Add People"
            type="button"
            disabled={disabled}
          >
            <IPersonAdd />
          </button>
        </li> */}

        <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title={dialog.settings.mute ? 'Unmute' : 'Mute'}
            type="button"
            disabled={disabled}
            onClick={() => {
              run({
                resource: getRoute(
                  `put/${routes.dialogs}/?dialog_id=${dialog.id}`,
                ),
                method: 'PUT',
                body: JSON.stringify({
                  mute: !dialog.settings.mute,
                }),
              });
            }}
          >
            {dialog.settings.mute ? (
              <INotificationsActiveOutlinedIcon />
            ) : (
              <INotificationsOffOutlined />
            )}
          </button>
        </li>

        <li className="nav-item list-inline-item d-none d-xl-block mr-0">
          <button
            type="button"
            disabled={disabled}
            className="nav-link btn btn-link text-muted px-3"
            title="Details"
            onClick={(e) => {
              setMessenger((currVal: MessengerType) => ({
                ...currVal,
                isChatSideBarOpen: true,
              }));
            }}
          >
            <IMoreVert />
          </button>
        </li>

        <li className="nav-item list-inline-item d-block d-xl-none">
          <div className="dropdown">
            <button
              className="nav-link btn btn-link text-muted px-0"
              type="button"
              title="Details"
              disabled={disabled}
              onClick={(e) => {
                setMessenger((currVal: MessengerType) => ({
                  ...currVal,
                  isChatSideBarOpen: true,
                }));
              }}
            >
              <IMoreVert />
            </button>
            <div className="dropdown-menu">
              <a
                className="dropdown-item d-flex align-items-center"
                href="#dialog-search"
              >
                Search <ISearch />
              </a>

              <button
                type="button"
                className="dropdown-item d-flex align-items-center"
              >
                Dialog Info
                <span className="ml-auto pl-5 fe-more-horizontal"></span>
              </button>

              <button
                className="dropdown-item d-flex align-items-center"
                disabled={disabled}
              >
                Add Members <IPersonAdd />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default SideBar;
