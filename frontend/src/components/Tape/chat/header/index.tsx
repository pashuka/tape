import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilState } from 'recoil';

import { Link } from 'react-router-dom';
import { routes } from '../../../../constants';

import { DialogType } from '../../../../hooks/recoil/dialog';
import { MessengerAtom } from '../../../../hooks/recoil/messenger';
import HeaderDialog from './dialog';
import SideBar from './sidebar';

dayjs.extend(relativeTime);

declare type HeaderPropsType = {
  dialog: DialogType | undefined;
};

const Header = ({ dialog }: HeaderPropsType) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);

  return (
    <div className="chat-header bg-light py-2 py-lg-3 px-2 px-lg-4">
      <div className="">
        <div className="row align-items-center">
          <div className="col-2 d-xl-none">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/${routes.tape}/${routes.dialogs}/`}
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
          {dialog && <HeaderDialog dialog={dialog} />}
          <SideBar isPending={true} />
        </div>
      </div>
    </div>
  );
};

export default Header;
