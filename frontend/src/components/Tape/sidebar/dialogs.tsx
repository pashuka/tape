import React, { Fragment } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import CardDialog from './cards/dialog/index';
import CardMember from './cards/member/index';
import Header from './header';
import { QSParamsType, ParamsKeyUser, routes } from '../../../constants';
import CardHeader from './cards/header';
import {
  dialogsState,
  DialogType,
  dialogsOffsetAtom,
} from '../../../hooks/recoil/dialog';
import { usersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import { searchQueryAtom } from '../../../hooks/recoil/search';
import { limitFetchMax } from '../../../hooks/recoil/constants';
import Overlay from '../../Overlay';

type PropsType = {
  scrollBottom: boolean;
};

const Dialogs = ({ scrollBottom }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();

  const [offset, setOffset] = useRecoilState(dialogsOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(dialogsState);
  const [records, setRecords] = React.useState<DialogType[]>(
    [] as DialogType[],
  );

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const filteredUsers = useRecoilValueLoadable(usersFilter);

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
                <CardMember
                  key={params[ParamsKeyUser]}
                  route={routes.participants}
                  username={params[ParamsKeyUser] || ''}
                />
              )}
              {searchQuery.length > 0 && (
                <Fragment>
                  {state === 'loading' || filteredUsers.state === 'loading' ? (
                    <div className="d-flex justify-content-center p-2">
                      <Overlay size="sm" badge={true} />
                    </div>
                  ) : (
                    <Fragment>
                      <CardHeader title="Search" />
                      {filteredUsers.state === 'hasValue' &&
                        filteredUsers.contents.map(({ username }) => (
                          <CardMember
                            key={username}
                            route={routes.dialogs}
                            username={username}
                          />
                        ))}
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
