import React, { Fragment } from 'react';
import { useRecoilState } from 'recoil';

import CardSettings from './cards/settings';
import CardNew from './cards/new';
import Header from './header';
import { searchSettingsQueryAtom } from '../../../hooks/recoil/search';
import { useRouteMatch } from 'react-router-dom';
import { QSParamsType, ParamsKeyUser } from '../../../constants';

type PropsType = {
  scrollTop: boolean;
  scrollBottom: boolean;
};

const Participants = ({ scrollTop, scrollBottom }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
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

            <nav className="nav nav-dialog d-block">
              {ParamsKeyUser in params && (
                <CardNew username={params[ParamsKeyUser] || ''} />
              )}
              <CardSettings to={'asd'} title="Profile" />
              <CardSettings to={'asd'} title="Account" />
              <CardSettings to={'asd'} title="Security" />
              <CardSettings to={'asd'} title="Notifications" />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
