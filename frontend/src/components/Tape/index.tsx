import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Navbar from './navbar';
import Dialogs from './dialogs/index';
import Chat from './chat/index';
import useUserAgent from '../../hooks/useUserAgent';
import { QSParamsType, ParamsKeyUser, ParamsKeyDialog } from '../../constants';
import { MessengerAtom } from '../../hooks/recoil/messenger';
import { currentDialogIdState } from '../../hooks/recoil/dialog';

const Messenger = () => {
  const { device } = useUserAgent();
  const [sidebarHeight, setSidebarHeight] = React.useState(0);
  const [sidebarScrollTop, setSidebarScrollTop] = React.useState(false);
  const [sidebarScrollBottom, setSidebarScrollBottom] = React.useState(false);
  const refNavbar = React.createRef<HTMLDivElement>();

  const [messenger] = useRecoilState(MessengerAtom);
  const setDialogId = useSetRecoilState(currentDialogIdState);

  const { params } = useRouteMatch<QSParamsType>();

  // TODO: slicing dialog items in sidebar using scrollTop/Bottom vars
  // TODO: onSelect dialog scroll sidebar visible part to see selected dialog item
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0) {
      setSidebarScrollTop(true);
    } else if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
      setSidebarScrollBottom(true);
    }
  };

  // The second argument is an array of values (usually props).
  // When it's an empty list, the callback will only be fired once, similar to componentDidMount.
  React.useEffect(() => {
    // const eventSource = new EventSource('/'+apis.version+'/?'+routes.events+'=subscribe',{withCredentials: true});
    // eventSource.onmessage = (es) => {console.log('message', es);};

    // Set specifics to messenger css styles
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';

    if (refNavbar.current) {
      // TODO: find the problem with zero offsetHeight and fix it
      setSidebarHeight(
        document.documentElement.clientHeight - 81, //refNavbar.current.clientHeight,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="messenger">
      <div
        ref={refNavbar}
        className="navigation navbar navbar-light justify-content-center py-xl-1 bg-white"
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
        <Dialogs
          scrollTop={sidebarScrollTop}
          scrollBottom={sidebarScrollBottom}
        />
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
        <Chat />
      </div>
    </div>
  );
};

export default Messenger;
