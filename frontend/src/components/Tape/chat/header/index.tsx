import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilState } from 'recoil';

import { Link, useRouteMatch } from 'react-router-dom';
import { routes, QSParamsType, ParamsKeyUser } from '../../../../constants';

import { DialogType } from '../../../../hooks/recoil/dialog';
import {
  MessengerAtom,
  MessengerType,
} from '../../../../hooks/recoil/messenger';
import HeaderDialog from './dialog';
import SideBar from './sidebar';
import HeaderWithUserInfo from './user';

dayjs.extend(relativeTime);

declare type HeaderPropsType = {
  dialog: DialogType | undefined;
};

const Header = ({ dialog }: HeaderPropsType) => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const { params } = useRouteMatch<QSParamsType>();

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
                    setMessenger((currVal: MessengerType) => ({
                      ...currVal,
                      isChatOpen: false,
                    }));
                  }}
                >
                  <IChevronLeft />
                </Link>
              </li>
            </ul>
          </div>
          {dialog ? (
            <HeaderDialog dialog={dialog} />
          ) : (
            ParamsKeyUser in params && (
              <HeaderWithUserInfo username={params[ParamsKeyUser] || ''} />
            )
          )}
          <SideBar disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default Header;
