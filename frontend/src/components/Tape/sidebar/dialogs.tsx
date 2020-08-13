import React, { Fragment } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

import CardDialog from './cards/dialog';
import CardSearch from './cards/search';
import CardNew from './cards/new';
import CardSkeleton from './cards/skeleton';
import Header from './header';
import { QSParamsType, ParamsKeyUser } from '../../../constants';
import CardHeader from './cards/header';
import {
  DialogsFilter,
  dialogsState,
  DialogType,
  dialogsOffsetAtom,
} from '../../../hooks/recoil/dialog';
import { authState } from '../../../hooks/recoil/auth';
import { UsersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import { searchQueryAtom } from '../../../hooks/recoil/search';
import { limitFetchMax } from '../../../hooks/recoil/constants';
import Overlay from '../../Overlay';

const DialogsSkeleton = ({ count = 1 }) => (
  <React.Fragment>
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </React.Fragment>
);

type PropsType = {
  scrollBottom: boolean;
};

const Dialogs = ({ scrollBottom }: PropsType) => {
  const iam = useRecoilValue(authState);
  const { params } = useRouteMatch<QSParamsType>();

  const [offset, setOffset] = useRecoilState(dialogsOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(dialogsState);
  const [records, setRecords] = React.useState<DialogType[]>(
    [] as DialogType[],
  );

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const filteredDialogs = useRecoilValue(DialogsFilter);
  const filteredUsers = useRecoilValueLoadable(UsersFilter);

  React.useEffect(() => {
    if (scrollBottom && offset + limitFetchMax === records.length) {
      setOffset((currVal: number) => currVal + limitFetchMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollBottom]);

  React.useEffect(() => {
    if (state === 'hasValue' && Array.isArray(contents)) {
      setRecords(contents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, contents]);

  return (
    <div className="tab-pane fade h-100 show active" id="tab-content-dialogs">
      <div className="d-flex flex-column h-100">
        <div className="hide-scrollbar">
          <div className="container-fluid pl-0 pr-0">
            <Header
              isPending={false}
              onChange={setSearchQuery}
              searchPlaceholder="Search dialogs or users..."
            />

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
                        <CardDialog key={_.id} dialog={_} />
                      ))}
                    </Fragment>
                  )}
                  {state === 'loading' || filteredUsers.state === 'loading' ? (
                    <DialogsSkeleton count={1} />
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
              {searchQuery.length === 0 &&
                records.map((_) => <CardDialog key={_.id} dialog={_} />)}
              {state === 'loading' && (
                <div className="d-flex justify-content-center p-2">
                  <Overlay size="sm" badge={true} />
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialogs;
