import React from 'react';
import ISettings from '@material-ui/icons/Settings';
import IChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import IPeople from '@material-ui/icons/People';
import IMeetingRoom from '@material-ui/icons/MeetingRoom';
import { useRecoilState } from 'recoil';

import Logo from '../../Logo/index';

import { Link, useLocation } from 'react-router-dom';
import { routes, getRoute } from '../../../constants';
import { MessengerAtom } from '../../../hooks/recoil/messenger';
import { useResetRecoilState } from 'recoil';
import { authState } from '../../../hooks/recoil/auth';
import { request } from '../../../hooks/recoil/request';
import { DialogsState } from '../../../hooks/recoil/dialog';
import { messagesState } from '../../../hooks/recoil/message';

type NavItemPropsType = {
  active?: boolean;
  to: string;
  title: string;
  children: JSX.Element;
};

const NavItem = ({ active, to, title, children }: NavItemPropsType) => (
  <li className="nav-item mt-xl-9">
    <Link
      className={`nav-link position-relative p-0 py-xl-4 ${
        active ? 'active' : ''
      }`}
      to={to}
      title={title}
    >
      {children}
      {/* {active && <div className="badge badge-dot badge-primary badge-top-center"></div>} */}
    </Link>
  </li>
);

const navItems: NavItemPropsType[] = [
  {
    to: `/${routes.tape}/${routes.participants}/`,
    title: 'Participants',
    children: <IPeople />,
  },
  {
    to: `/${routes.tape}/${routes.dialogs}/`,
    title: 'Messages',
    children: <IChatBubbleOutline />,
  },
  {
    to: `/${routes.tape}/${routes.settings.profile}/`,
    title: 'Settings',
    children: <ISettings />,
  },
];

const Navbar = () => {
  const [messenger, setMessenger] = useRecoilState(MessengerAtom);
  const [reset, setReset] = React.useState(false);
  const resetAuth = useResetRecoilState(authState);
  const resetDialogs = useResetRecoilState(DialogsState);
  const resetMessages = useResetRecoilState(messagesState);
  const { pathname } = useLocation();

  React.useEffect(() => {
    const fetchSignOut = async () => {
      const result = await request<{ status: string }>(
        getRoute(routes.auth.signout),
      ).then(
        (data) => data,
        (reason) => {
          return reason;
        },
      );
      if ('status' in result && result.status === 'ok') {
        resetAuth();
        resetDialogs();
        resetMessages();
      }
    };

    if (reset) {
      fetchSignOut();
    }
    // eslint-disable-next-line
  }, [reset]);

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

      {navItems.map((props) => (
        <NavItem
          key={props.title}
          {...props}
          active={pathname.indexOf(props.to) !== -1}
        />
      ))}

      <li className="nav-item mt-xl-9">
        <a
          className="nav-link position-relative p-0 py-xl-4"
          href="#sign-out"
          title="Sign out"
          onClick={(e) => {
            e.preventDefault();
            window.confirm('Sign out?') && setReset(true);
          }}
        >
          <IMeetingRoom />
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
