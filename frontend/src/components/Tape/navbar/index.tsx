import React from 'react';
import ISettings from '@material-ui/icons/Settings';
import IChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import IPeople from '@material-ui/icons/People';
// import IEdit from '@material-ui/icons/Edit';
import { useRecoilState } from 'recoil';

import Logo from '../../Logo/index';

import { Link } from 'react-router-dom';
import { routes } from '../../../constants';
import { MessengerAtom } from '../../../hooks/recoil/messenger';

const Navbar = () => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);

  return (
    <ul className="nav navbar-nav navbar-light flex-row flex-xl-column flex-grow-1 justify-content-between justify-content-xl-center py-3 py-lg-0">
      <li className="nav-item">
        <Link
          className="nav-link position-relative p-0 py-xl-4"
          to="/"
          onClick={(e) => {
            setMessenger({ isOpen: false, isChatOpen: messenger.isChatOpen });
          }}
        >
          <Logo
            width="32"
            height="32"
            className="mx-auto rounded-circle bg-white"
          />
        </Link>
      </li>

      <li className="nav-item d-none d-xl-block flex-xl-grow-1"></li>

      {/* <li className="nav-item">
        <a
          className="nav-link position-relative p-0 py-xl-4"
          href="#tab-content-create-chat"
          title="Create chat"
        >
          <IEdit />
        </a>
      </li> */}

      <li className="nav-item mt-xl-9">
        <a
          className="nav-link position-relative p-0 py-xl-4"
          href="#tab-content-friends"
          title="Friends"
        >
          <IPeople />
        </a>
      </li>

      <li className="nav-item mt-xl-9">
        <Link
          className="nav-link position-relative p-0 py-xl-4 active"
          to={`/${routes.dialogs}/`}
          title="Messages"
        >
          <IChatBubbleOutline />
          {/* <div className="badge badge-dot badge-primary badge-top-center"></div> */}
        </Link>
      </li>

      <li className="nav-item mt-xl-9">
        <a
          className="nav-link position-relative p-0 py-xl-4"
          href="#settings"
          title="Settings"
        >
          <ISettings />
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
