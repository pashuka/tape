import React from 'react';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { MessengerType, MessengerAtom } from '../../../hooks/recoil/messenger';
import { useSetRecoilState } from 'recoil';

const SideBarHeader = () => {
  const setMessenger = useSetRecoilState(MessengerAtom);
  return (
    <div className="py-2 py-lg-3">
      <div className="container-fluid">
        <ul className="nav justify-content-between align-items-center">
          <li className="nav-item list-inline-item">
            <button
              type="button"
              className="nav-link btn btn-link text-muted px-0"
              onClick={(e) => {
                setMessenger((currVal: MessengerType) => ({
                  ...currVal,
                  isChatSideBarOpen: false,
                }));
              }}
            >
              <IChevronLeft />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

type PropsType = {
  isOpen?: boolean;
};

const ChatSideBar = ({ isOpen }: PropsType) => {
  return (
    <div className={`chat-sidebar ${isOpen ? 'chat-sidebar-visible' : ''}`}>
      <div className="d-flex h-100 flex-column">
        <SideBarHeader />
        <div className="hide-scrollbar flex-fill bg-white">content</div>
      </div>
    </div>
  );
};
export default ChatSideBar;
