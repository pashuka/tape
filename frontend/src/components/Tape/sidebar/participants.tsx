import React from 'react';
import { useRecoilValueLoadable, useRecoilState } from 'recoil';

import CardMember from './cards/member/index';
import CardUser from './cards/user';
import CardCreateGroup from './cards/create/group';
import Header from './header';
import CardHeader from './cards/header';
import { searchQueryAtom } from '../../../hooks/recoil/search';
import { usersFilter } from '../../../hooks/recoil/user';
import { useRouteMatch } from 'react-router-dom';
import {
  QSParamsType,
  ParamsKeyUser,
  routes,
  ParamsKeyCreateGroup,
} from '../../../constants';
import {
  membersState,
  membersOffsetAtom,
  MemberType,
} from '../../../hooks/recoil/member';
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
  const [selected, setSelected] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const filteredUsers = useRecoilValueLoadable(usersFilter);

  const isGroupCreateState = ParamsKeyCreateGroup in params;

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
    <div className="tab-pane fade h-100 show active">
      <div className="d-flex flex-column h-100">
        <div className="hide-scrollbar">
          <div className="container-fluid pl-0 pr-0">
            <Header
              isPending={false}
              onChange={setSearchQuery}
              searchPlaceholder="Search users..."
            />

            <nav className="nav nav-dialog d-block">
              {isGroupCreateState && (
                <React.Fragment>
                  <CardHeader title="Group settings" />
                  <CardCreateGroup selected={selected} />
                  {searchQuery.length === 0 && (
                    <CardHeader title="Select members" />
                  )}
                </React.Fragment>
              )}
              {ParamsKeyUser in params && (
                <CardMember
                  route={routes.participants}
                  username={params[ParamsKeyUser] || ''}
                />
              )}
              {searchQuery.length > 0 && (
                <React.Fragment>
                  {state === 'loading' || filteredUsers.state === 'loading' ? (
                    <div className="d-flex justify-content-center p-2">
                      <Overlay size="sm" badge={true} />
                    </div>
                  ) : (
                    <React.Fragment>
                      <CardHeader title="Search" />
                      {filteredUsers.state === 'hasValue' &&
                        filteredUsers.contents.map(({ username }) => (
                          <CardMember
                            key={username}
                            route={routes.participants}
                            username={username}
                            selectable={isGroupCreateState}
                            selected={selected.includes(username)}
                            onSelect={(username) => {
                              setSelected(
                                selected.includes(username)
                                  ? selected.filter((_) => _ !== username)
                                  : [...selected, username],
                              );
                            }}
                          />
                        ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {searchQuery.length === 0 &&
                records.map((_) => (
                  <CardUser
                    key={_.username}
                    member={_}
                    selectable={isGroupCreateState}
                    selected={selected.includes(_.username)}
                    onSelect={
                      isGroupCreateState
                        ? (username) => {
                            setSelected(
                              selected.includes(username)
                                ? selected.filter((_) => _ !== username)
                                : [...selected, username],
                            );
                          }
                        : undefined
                    }
                  />
                ))}
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

export default Participants;
