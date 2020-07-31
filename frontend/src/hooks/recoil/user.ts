import Recoil from 'recoil';
import { request } from './request';
import { searchQueryAtom } from './search';
import { routes, getRoute } from '../../constants';
import { limitSearchMax } from './constants';
import { authState } from './auth';

type UserProfileType = {
  picture?: string;
  description?: object[];
  sectors?: string;
  skills?: string;
  socials?: string;
};

export type UserType = {
  username: string;
  realname: string | undefined;
  profile: UserProfileType;
};

export function instanceOfUser(o: any): o is UserType {
  return o && 'username' in o;
}

export const userInfoQuery = Recoil.selectorFamily<
  UserType | undefined,
  string | undefined
>({
  key: 'userInfoQuery',
  get: (username) => async () => {
    return username
      ? await request<UserType>(
          getRoute(`get/${routes.user}/?username=${String(username)}`),
        ).then(
          (data) => data,
          (reason) => {
            throw reason;
          },
        )
      : new Promise((resolve) => resolve());
  },
});

export const UsersFilter = Recoil.selector<UserType[]>({
  key: 'UsersFilter',
  get: async ({ get }) => {
    const iam = get(authState);
    const query = get(searchQueryAtom);
    return query.length
      ? await request<UserType[]>(
          getRoute(`find/${routes.user}/?query=${String(query)}`),
        ).then(
          (data) =>
            data
              .filter((_) => iam?.username !== _.username)
              .slice(0, limitSearchMax),
          (reason) => {
            throw reason;
          },
        )
      : new Promise((resolve) => resolve([] as UserType[]));
  },
});
