import React, { Fragment } from "react";
import { useFetch } from "react-async";
import { useRecoilState } from "recoil";

import CardDialog from "./cards/dialog";
import CardSearch from "./cards/search";
import CardNew from "./cards/new";
import DialogsSkeleton from "./skeleton";
import Header from "./header";
import {
  QSParamsType,
  ParamsKeyUser,
  host,
  apis,
  routes,
} from "../../../constants";
import CardHeader from "./cards/header";
import { DialogsAtom, DialogType } from "../../../hooks/recoil/dialog";
import { useRecoilStore } from "../../../hooks/recoil/request";
import { AuthAtom } from "../../../hooks/recoil/auth";
import { UsersAtom, UserType } from "../../../hooks/recoil/user";
import { useRouteMatch } from "react-router-dom";

const indexOfLower = (a: string, b: string) =>
  a.toLocaleLowerCase().indexOf(b.toLocaleLowerCase());

const Dialogs = () => {
  const [{ data: iam }] = useRecoilState(AuthAtom);
  const [{ data: users }, setUsers] = useRecoilState(UsersAtom);

  const { params } = useRouteMatch<QSParamsType>();

  useRecoilStore<DialogType[]>(
    DialogsAtom,
    `${host}/${apis.version}/findMy/${routes.dialogs}/`,
  );
  const [{ isPending: isPendingDialogs, data: dialogs }] = useRecoilState(
    DialogsAtom,
  );

  const { data: dataSearch, isPending: isPendingSearch, run } = useFetch<
    UserType[]
  >(
    `${host}/${apis.v}/find/${routes.user}/?query`,
    { headers: { accept: "application/json" } },
    { defer: true },
  );

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchDialogs, setSearchDialogs] = React.useState<DialogType[]>([]);
  const [searchUsers, setSearchUsers] = React.useState<UserType[]>([]);

  React.useEffect(() => {
    if (searchQuery.length) {
      run({
        resource: `${host}/${apis.version}/find/${routes.user}/?query=${searchQuery}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  React.useEffect(() => {
    if (dataSearch && users) {
      const toUpdate = dataSearch
        .filter((_) => _.username !== iam?.username)
        .filter((_s) => !users.find((_u) => _s.username === _u.username));
      if (toUpdate.length > 0) {
        setUsers((prev) =>
          prev.data ? { ...prev, data: [...prev.data, ...toUpdate] } : prev,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearch]);

  React.useEffect(() => {
    if (searchQuery.length > 0 && dialogs) {
      setSearchDialogs(
        dialogs.filter(({ participants }) =>
          participants.find(
            (_) => iam?.username !== _ && indexOfLower(_, searchQuery) !== -1,
          ),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dialogs]);

  React.useEffect(() => {
    if (searchQuery.length > 0 && users) {
      setSearchUsers(
        users.filter(
          ({ username, realname }) =>
            indexOfLower(username, searchQuery) !== -1 ||
            (realname && indexOfLower(realname, searchQuery) !== -1),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, users]);

  return (
    <div className="tab-pane fade h-100 show active" id="tab-content-dialogs">
      <div className="d-flex flex-column h-100">
        <div className="hide-scrollbar">
          <div className="container-fluid pl-0 pr-0">
            <Header isPending={isPendingSearch} onChange={setSearchQuery} />

            <nav className="nav nav-dialog d-block">
              {ParamsKeyUser in params && (
                <CardNew username={params[ParamsKeyUser] || ""} />
              )}
              {searchQuery.length > 0 && (
                <Fragment>
                  {searchDialogs?.length > 0 && (
                    <Fragment>
                      <CardHeader title="Dialogs" />
                      {searchDialogs?.map((_) => (
                        <CardDialog key={_.dialog_id} dialog={_} />
                      ))}
                    </Fragment>
                  )}
                  {isPendingSearch ? (
                    <DialogsSkeleton />
                  ) : (
                    <Fragment>
                      <CardHeader title="Search" />
                      {searchUsers
                        ?.filter((_) => _.username !== iam?.username)
                        .map((_) => (
                          <CardSearch key={_.username} user={_} />
                        ))}
                    </Fragment>
                  )}
                </Fragment>
              )}
              {isPendingDialogs && <DialogsSkeleton />}
              {!isPendingDialogs &&
                !searchQuery.length &&
                dialogs?.map((_) => (
                  <CardDialog key={_.dialog_id} dialog={_} />
                ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialogs;
