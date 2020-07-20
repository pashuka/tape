import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import Navbar from './navbar';
import Dialogs from './dialogs/index';
import Chat from './chat/index';
import useUserAgent from '../../hooks/useUserAgent';
import { QSParamsType, ParamsKeyUser, ParamsKeyDialog } from '../../constants';
import { MessengerAtom } from '../../hooks/recoil/messenger';
const Messenger = () => {
  const { device } = useUserAgent();
  const [sidebarHeight, setSidebarHeight] = React.useState(0);
  const refNavbar = React.createRef<HTMLDivElement>();

  const [messenger] = useRecoilState(MessengerAtom);

  const { params } = useRouteMatch<QSParamsType>();

  // The second argument is an array of values (usually props).
  // When it's an empty list, the callback will only be fired once, similar to componentDidMount.
  React.useEffect(() => {
    // Set specifics to messenger css styles
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    if (refNavbar.current) {
      setSidebarHeight(
        document.documentElement.clientHeight - refNavbar.current.clientHeight,
      );
    }

    return () => {
      // Unset specifics to messenger css styles
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="messenger">
      <div
        ref={refNavbar}
        className="navigation navbar navbar-light justify-content-center py-xl-1 bg-gray-200"
      >
        <Navbar />
      </div>
      <div
        className="sidebar"
        style={{
          height: device.type === 'mobile' ? sidebarHeight : '',
        }}
      >
        <Dialogs />
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
