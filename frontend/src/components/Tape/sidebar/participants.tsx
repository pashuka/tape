import React, { Fragment } from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';

import CardUser from './cards/user';
import CardNew from './cards/new';
import Header from './header';
import CardHeader from './cards/header';
import { searchQueryAtom } from '../../../hooks/recoil/search';
import { UsersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import { QSParamsType, ParamsKeyUser } from '../../../constants';
import {
  membersState,
  membersOffsetAtom,
  MemberType,
} from '../../../hooks/recoil/members';
import Overlay from '../../Overlay';
import { limitFetchMax } from '../../../hooks/recoil/constants';

type PropsType = {
  scrollBottom: boolean;
};

const Participants = ({ scrollBottom }: PropsType) => {
  const { params } = useRouteMatch<QSParamsType>();

  const [offset, setOffset] = useRecoilState(membersOffsetAtom);
  const { state, contents } = useRecoilValueLoadable(membersState);
  const [records, setRecords] = React.useState<MemberType[]>(
    [] as MemberType[],
  );

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
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
              searchPlaceholder="Search users..."
            />

            <nav className="nav nav-dialog d-block">
              <CardHeader title="Participants" />
              {ParamsKeyUser in params && (
                <CardNew username={params[ParamsKeyUser] || ''} />
              )}
              {records.map((_) => (
                <CardUser key={_.username} member={_} />
              ))}
              {state === 'loading' && (
                <div className="d-flex justify-content-center p-2">
                  <Overlay size="sm" badge={true} />
                </div>
              )}
              {searchQuery.length > 0 &&
                filteredUsers.state === 'hasValue' &&
                Array.isArray(filteredUsers.contents) && (
                  <Fragment>
                    <CardHeader title="Search" />
                    {filteredUsers.contents.map((_) => (
                      <CardUser key={_.username} member={_} />
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
