import React, { Fragment } from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';

import CardUser from './cards/user';
import CardUserInfo from './cards/userInfo';
import CardNew from './cards/new';
import Header from './header';
import CardHeader from './cards/header';
import { dialogParticipantsQuery } from '../../../hooks/recoil/dialog';
import { searchQueryAtom } from '../../../hooks/recoil/search';
import { UsersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import { QSParamsType, ParamsKeyUser } from '../../../constants';

type PropsType = {
  scrollTop: boolean;
  scrollBottom: boolean;
};

const Participants = ({ scrollTop, scrollBottom }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();
  const participants = useRecoilValueLoadable(dialogParticipantsQuery);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const filteredUsers = useRecoilValueLoadable(UsersFilter);

  return (
    <div className="tab-pane fade h-100 show active" id="tab-content-dialogs">
      <div className="d-flex flex-column h-100">
        <div className="hide-scrollbar">
          <div className="container-fluid pl-0 pr-0">
            <Header isPending={false} onChange={setSearchQuery} />

            <nav className="nav nav-dialog d-block">
              {ParamsKeyUser in params && (
                <CardNew username={params[ParamsKeyUser] || ''} />
              )}
              {participants.state === 'hasValue' &&
                Array.isArray(participants.contents) && (
                  <Fragment>
                    <CardHeader title="Participants" />
                    {participants.contents?.map((_) => (
                      <CardUserInfo key={_.username} participant={_} />
                    ))}
                  </Fragment>
                )}
              {searchQuery.length > 0 &&
                filteredUsers.state === 'hasValue' &&
                Array.isArray(filteredUsers.contents) && (
                  <Fragment>
                    <CardHeader title="Search" />
                    {filteredUsers.contents.map((_) => (
                      <CardUser key={_.username} participant={_} />
                    ))}
                  </Fragment>
                )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
