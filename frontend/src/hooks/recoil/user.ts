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

type userInfoParamsType = {
  username: string;
  withDialog?: boolean;
};

export const userInfoQuery = Recoil.selectorFamily<
  UserType | MemberType | undefined,
  userInfoParamsType
>({
  key: 'userInfoQuery',
  get: ({ username, withDialog }) => async () => {
    return await request<UserType | MemberType>(
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
    );
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
