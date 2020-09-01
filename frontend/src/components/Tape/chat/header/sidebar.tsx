import React from 'react';

import ISearch from '@material-ui/icons/Search';
import IPersonAdd from '@material-ui/icons/PersonAdd';
import IMoreVert from '@material-ui/icons/MoreVert';
import { useSetRecoilState } from 'recoil';
import {
  MessengerAtom,
  MessengerType,
} from '../../../../hooks/recoil/messenger';

declare type PropsType = {
  disabled?: boolean;
};

const SideBar = ({ disabled = false }: PropsType) => {
  const setMessenger = useSetRecoilState(MessengerAtom);
  return (
    <div className="col-2 col-xl-4 text-right">
      <ul className="nav justify-content-end">
        <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title="Search this chat"
            type="button"
            disabled={disabled}
          >
            <ISearch />
          </button>
        </li>

        <li className="nav-item list-inline-item d-none d-xl-block mr-2">
          <button
            className="nav-link btn btn-link text-muted px-3"
            title="Add People"
            type="button"
            disabled={disabled}
          >
            <IPersonAdd />
          </button>
        </li>

        <li className="nav-item list-inline-item d-none d-xl-block mr-0">
          <button
            type="button"
            disabled={disabled}
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
              disabled={disabled}
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

              <button
                type="button"
                className="dropdown-item d-flex align-items-center"
                onClick={(e) => {
                  setMessenger((currVal: MessengerType) => ({
                    ...currVal,
                    isChatSideBarOpen: true,
                  }));
                }}
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
