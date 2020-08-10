import React from 'react';
import { useRecoilState } from 'recoil';

import CardLink from './cards/link';
import Header from './header';
import { searchSettingsQueryAtom } from '../../../hooks/recoil/search';
import { routes } from '../../../constants';

const links = [
  {
    title: 'Profile',
    to: `/${routes.tape}/${routes.settings.profile}/`,
    iconName: 'face',
    color: 'text-success',
  },
  {
    title: 'Account',
    to: `/${routes.tape}/${routes.settings.account}/`,
    iconName: 'settings',
    color: 'text-info',
  },
  {
    title: 'Security',
    to: `/${routes.tape}/${routes.settings.security}/`,
    iconName: 'security',
    color: 'text-primary',
  },
  {
    title: 'Notifications',
    to: `/${routes.tape}/${routes.settings.notifications}/`,
    iconName: 'notifications',
    color: 'text-gray-300',
    disabled: true,
  },
];

type PropsType = {
  scrollTop: boolean;
  scrollBottom: boolean;
};

const Settings = ({ scrollTop, scrollBottom }: PropsType) => {
  const [, setSearchSettingsQuery] = useRecoilState(searchSettingsQueryAtom);

  return (
    <div className="tab-pane fade h-100 show active" id="tab-content-dialogs">
      <div className="d-flex flex-column h-100">
        <div className="hide-scrollbar">
          <div className="container-fluid pl-0 pr-0">
            <Header
              isPending={false}
              onChange={setSearchSettingsQuery}
              searchPlaceholder="Search settings..."
            />

            <nav className="nav nav-settings d-block">
              {links.map((props, index) => (
                <CardLink key={index} {...props} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
