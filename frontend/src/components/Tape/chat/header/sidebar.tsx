import React from 'react';

import ISearch from '@material-ui/icons/Search';
import IInfo from '@material-ui/icons/Info';
import IDeleteForever from '@material-ui/icons/DeleteForever';
import IExitToApp from '@material-ui/icons/ExitToApp';
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
import useOutsideClick from '../../../../hooks/useOutsideClick';
import { useTranslation } from 'react-i18next';

declare type PropsType = {
  dialog: DialogType;
  disabled?: boolean;
};

const SideBar = ({ dialog, disabled = false }: PropsType) => {
  const { t } = useTranslation();
  const setMessenger = useSetRecoilState(MessengerAtom);
  const [ref, show, setShow] = useOutsideClick<HTMLDivElement>(false);
  const { run } = useFetch<MemberType>(
    getRoute(`put/${routes.dialogs}/`),
    {
      headers: { accept: 'application/json' },
    },
    { defer: true },
  );
  const handleMute = () => {
    run({
      resource: getRoute(`put/${routes.dialogs}/?dialog_id=${dialog.id}`),
      method: 'PUT',
      body: JSON.stringify({
        mute: !dialog.settings.mute,
      }),
    });
  };
  return (
    <div className="col-2 col-xl-6 text-right">
      <ul className="nav justify-content-end">
        <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-gray-400 px-3"
            title="Search this chat"
            type="button"
            disabled={true}
          >
            <ISearch />
          </button>
        </li>

        <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title={dialog.settings.mute ? 'Unmute' : 'Mute'}
            type="button"
            disabled={disabled}
            onClick={() => handleMute()}
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
                isChatSideBarOpen: !currVal.isChatSideBarOpen,
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
              onClick={() => setShow(!show)}
            >
              <IMoreVert />
            </button>
            <div
              ref={ref}
              className={`dropdown-menu dropdown-menu-right border-light ${
                show ? 'show' : ''
              } shadow`}
            >
              <button
                type="button"
                className="dropdown-item d-flex align-items-center text-gray-400"
                disabled={true}
              >
                Search{' '}
                <span className="ml-auto pl-3 text-gray-400">
                  <ISearch />
                </span>
              </button>

              <button
                className="dropdown-item d-flex align-items-center"
                title={dialog.settings.mute ? 'Unmute' : 'Mute'}
                type="button"
                onClick={() => handleMute()}
              >
                {dialog.settings.mute ? 'Unmute' : 'Mute'}
                <span className="ml-auto pl-3 text-gray-400">
                  {dialog.settings.mute ? (
                    <INotificationsActiveOutlinedIcon />
                  ) : (
                    <INotificationsOffOutlined />
                  )}
                </span>
              </button>

              <button
                type="button"
                className="dropdown-item d-flex align-items-center"
                onClick={(e) => {
                  setShow(!show);
                  setMessenger((currVal: MessengerType) => ({
                    ...currVal,
                    isChatSideBarOpen: !currVal.isChatSideBarOpen,
                  }));
                }}
              >
                Info{' '}
                <span className="ml-auto pl-3 text-gray-200">
                  <IInfo />
                </span>
              </button>

              <button
                type="button"
                className="dropdown-item d-flex align-items-center"
                onClick={(e) => {
                  setShow(!show);
                  window.confirm(
                    t(
                      dialog.dialog_type === 'direct'
                        ? 'Are you sure you want to delete dialog?'
                        : 'Are you sure you want to leave group?',
                    ),
                  ) && console.log('delete/leave');
                }}
              >
                {dialog.dialog_type === 'direct' ? 'Delete' : 'Leave group'}{' '}
                <span className="ml-auto pl-3 text-gray-400">
                  {dialog.dialog_type === 'direct' ? (
                    <IDeleteForever />
                  ) : (
                    <IExitToApp />
                  )}
                </span>
              </button>

              {/* <button
                className="dropdown-item d-flex align-items-center"
                disabled={disabled}
              >
                Add Members <IPersonAdd />
              </button> */}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default SideBar;
