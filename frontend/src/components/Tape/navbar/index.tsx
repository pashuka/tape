import React from 'react';
import ISettings from '@material-ui/icons/Settings';
import IChat from '@material-ui/icons/Chat';
import IPeople from '@material-ui/icons/People';
import IMeetingRoom from '@material-ui/icons/MeetingRoom';
import { useRecoilValue } from 'recoil';

import { Link, useLocation } from 'react-router-dom';
import { routes, getRoute } from '../../../constants';
import { useResetRecoilState } from 'recoil';
import { authState } from '../../../hooks/recoil/auth';
import { request } from '../../../hooks/recoil/request';
import Avatar from '../components/avatar';

const iconSize = '24px';

type NavItemPropsType = {
  active?: boolean;
  to: string;
  title: string;
  children: JSX.Element;
};

const NavItem = ({ active, to, title, children }: NavItemPropsType) => (
  <li className="nav-item">
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
    children: <IPeople style={{ width: iconSize, height: iconSize }} />,
  },
  {
    to: `/${routes.tape}/${routes.dialogs}/`,
    title: 'Messages',
    children: <IChat style={{ width: iconSize, height: iconSize }} />,
  },
  {
    to: `/${routes.tape}/${routes.settings.index}/`,
    title: 'Settings',
    children: <ISettings style={{ width: iconSize, height: iconSize }} />,
  },
];

const Navbar = () => {
  const [reset, setReset] = React.useState(false);
  const iam = useRecoilValue(authState);
  const resetAuth = useResetRecoilState(authState);
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
        // TODO: deal with reset recoil SM atoms/selectors
        window.location.reload();
      }
    };

    if (reset) {
      fetchSignOut();
    }
    // eslint-disable-next-line
  }, [reset]);

  return (
    <ul className="nav navbar-nav navbar-light flex-row flex-xl-column flex-grow-1 justify-content-between justify-content-xl-center py-2 py-lg-0">
      <li className="nav-item">
        <Link
          className="nav-link position-relative p-0 py-xl-4"
          to={`/${routes.tape}/${routes.settings.profile}/`}
        >
          <Avatar
            picture={iam?.profile?.picture}
            realname={iam?.realname}
            username={iam?.username}
            size="xs"
            color="text-muted"
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

      <li className="nav-item">
        <a
          className="nav-link position-relative p-0 py-xl-4"
          href="#sign-out"
          title="Sign out"
          onClick={(e) => {
            e.preventDefault();
            window.confirm('Sign out?') && setReset(true);
          }}
        >
          <IMeetingRoom style={{ width: iconSize, height: iconSize }} />
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
