import Recoil from 'recoil';
import { request } from './request';
import { searchQueryAtom } from './search';
import { routes, getRoute } from '../../constants';
import { MemberType } from './member';

type UserProfileType = {
  picture?: string;
};

export type UserNameType = {
  username: string;
};

export type UserType = UserNameType & {
  realname: string | undefined;
  profile: UserProfileType;
};

export function instanceOfUser(o: any): o is UserType {
  return o && 'username' in o;
}

const atomTrigger = ({ username, withDialog }: userInfoParamsType) =>
  Recoil.atom({
    key: `userInfoTrigger-${username}-${withDialog}`,
    default: 0,
  });

type userInfoParamsType = {
  username: string;
  withDialog?: boolean;
};

export const userInfoQuery = Recoil.selectorFamily<
  UserType | MemberType | undefined,
  userInfoParamsType
>({
  key: 'userInfoQuery',
  get: ({ username, withDialog }) => async ({ get }) => {
    get(atomTrigger({ username, withDialog })); // 'register' as a resetable dependency
    return username.length
      ? await request<UserType | MemberType>(
          getRoute(
            `get/${routes.user}/?username=${String(username)}${
              withDialog ? '&withDialog=true' : ''
            }`,
          ),
        ).then(
          (data) => (instanceOfUser(data) ? data : undefined),
          (reason) => {
            throw reason;
          },
        )
      : undefined;
  },
  set: ({ username, withDialog }) => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger({ username, withDialog }), (v) => v + 1);
    }
  },
});

export const usersFilter = Recoil.selector<UserNameType[]>({
  key: 'usersFilter',
  get: async ({ get }) => {
    const query = get(searchQueryAtom);
    return query.length
      ? await request<UserNameType[]>(
          getRoute(`find/${routes.user}/?query=${String(query)}`),
        ).then(
          (data) => (Array.isArray(data) ? data : ([] as UserNameType[])),
          (reason) => {
            throw reason;
          },
        )
      : ([] as UserNameType[]);
  },
});
