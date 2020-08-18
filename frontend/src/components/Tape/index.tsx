import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import Navbar from './navbar';
import DialogsBar from './sidebar/dialogs';
import ParticipantsBar from './sidebar/participants';
import SettingsBar from './sidebar/settings';
import Chat from './chat/index';
import useUserAgent from '../../hooks/useUserAgent';
import {
  QSParamsType,
  ParamsKeyUser,
  ParamsKeyDialog,
  getRoute,
  routes,
} from '../../constants';
import { MessengerAtom } from '../../hooks/recoil/messenger';
import { currentDialogIdState } from '../../hooks/recoil/dialog';
import SettingsContent from './settings/index';
import { messagesOffsetAtom } from '../../hooks/recoil/message';

export enum TabEnum {
  Dialogs,
  Participants,
  Settings,
}

type PropsType = {
  tab: TabEnum;
  route?: string;
};

const Messenger = ({ tab, route }: PropsType) => {
  const { device } = useUserAgent();
  const [sidebarHeight, setSidebarHeight] = React.useState(0);
  const [sidebarScrollOnBottom, setSidebarScrollOnBottom] = React.useState(
    false,
  );
  const refNavbar = React.createRef<HTMLDivElement>();

  const [messenger] = useRecoilState(MessengerAtom);
  const setDialogId = useSetRecoilState(currentDialogIdState);
  const resetMessagesOffset = useResetRecoilState(messagesOffsetAtom);

  const { params } = useRouteMatch<QSParamsType>();

  // TODO: slicing dialog items in sidebar using scrollTop/Bottom variables
  // TODO: onSelect dialog scroll sidebar visible part to see selected dialog item
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0) {
      // setSidebarScrollTop(true);
    } else if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
      setSidebarScrollOnBottom(true);
    } else {
      // setSidebarScrollTop(false);
      setSidebarScrollOnBottom(false);
    }
  };

  // The second argument is an array of values (usually props).
  // When it's an empty list, the callback will only be fired once, similar to componentDidMount.
  React.useEffect(() => {
    const eventSource = new EventSource(
      getRoute('?' + routes.events + '=subscribe'),
      { withCredentials: true },
    );
    eventSource.onmessage = (es) => {
      // console.log('message', es);
    };

    // Set specifics to messenger css styles
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';

    if (refNavbar.current) {
      // TODO: find the problem with zero offsetHeight and fix it
      setSidebarHeight(
        document.documentElement.clientHeight - 60, //refNavbar.current.clientHeight,
      );
    }

    return () => {
      // Unset specifics to messenger css styles
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setDialogId(params[ParamsKeyDialog]);
    resetMessagesOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  let sidebarComponent = null;
  let mainComponent = null;
  switch (tab) {
    case TabEnum.Participants:
      sidebarComponent = (
        <ParticipantsBar scrollBottom={sidebarScrollOnBottom} />
      );
      mainComponent = <Chat />;
      break;

    case TabEnum.Settings:
      sidebarComponent = <SettingsBar scrollBottom={sidebarScrollOnBottom} />;
      mainComponent = <SettingsContent current={route} />;
      break;

    case TabEnum.Dialogs:
    default:
      sidebarComponent = <DialogsBar scrollBottom={sidebarScrollOnBottom} />;
      mainComponent = <Chat />;
      break;
  }
  return (
    <div className="messenger">
      <div
        ref={refNavbar}
        className="navigation navbar navbar-light justify-content-center py-xl-1 bg-white pt-0"
      >
        <Navbar />
      </div>
      <div
        onScroll={handleScroll}
        className="sidebar"
        style={{
          height: device.type === 'mobile' ? sidebarHeight : '',
        }}
      >
        {sidebarComponent}
      </div>
      <div
        className={`main ${
          (device.type === 'mobile' && params[ParamsKeyDialog]) ||
          params[ParamsKeyUser] ||
          messenger.isChatOpen
            ? 'main-visible'
            : ''
        }`}
      >
        {mainComponent}
      </div>
    </div>
  );
};

export default Messenger;
