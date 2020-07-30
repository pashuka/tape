import React, { Fragment } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import CardDialog from './cards/dialog';
import CardSearch from './cards/search';
import CardNew from './cards/new';
import CardSkeleton from './cards/skeleton';
import Header from './header';
import { QSParamsType, ParamsKeyUser } from '../../../constants';
import CardHeader from './cards/header';
import { DialogsFilter, DialogsState } from '../../../hooks/recoil/dialog';
import { authState } from '../../../hooks/recoil/auth';
import { UsersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import { searchQueryAtom } from '../../../hooks/recoil/search';

const DialogsSkeleton = ({ count = 10 }) => (
  <React.Fragment>
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </React.Fragment>
);

type PropsType = {
  scrollTop: boolean;
  scrollBottom: boolean;
};

const Dialogs = ({ scrollTop, scrollBottom }: PropsType) => {
  const iam = useRecoilValue(authState);
  const { params } = useRouteMatch<QSParamsType>();

  const { state, contents } = useRecoilValueLoadable(DialogsState);

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const filteredDialogs = useRecoilValue(DialogsFilter);
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
              {searchQuery.length > 0 && (
                <Fragment>
                  {filteredDialogs && filteredDialogs?.length > 0 && (
                    <Fragment>
                      <CardHeader title="Dialogs" />
                      {filteredDialogs.map((_) => (
                        <CardDialog key={_.dialog_id} dialog={_} />
                      ))}
                    </Fragment>
                  )}
                  {state === 'loading' || filteredUsers.state === 'loading' ? (
                    <DialogsSkeleton />
                  ) : (
                    <Fragment>
                      <CardHeader title="Search" />
                      {filteredUsers.state === 'hasValue' &&
                        filteredUsers.contents
                          ?.filter((_) => _.username !== iam?.username)
                          .map((_) => <CardSearch key={_.username} user={_} />)}
                    </Fragment>
                  )}
                </Fragment>
              )}
              {state === 'loading' && <DialogsSkeleton />}
              {state === 'hasValue' &&
                searchQuery.length === 0 &&
                Array.isArray(contents) &&
                contents
                  ?.slice(0, 128)
                  .map((_) => <CardDialog key={_.dialog_id} dialog={_} />)}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialogs;
