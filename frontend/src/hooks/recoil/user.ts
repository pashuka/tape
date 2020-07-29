import Recoil from 'recoil';
import { request } from './request';
import { SearchQueryAtom } from './search';
import { routes, apis, host } from '../../constants';
import { limitSearchMax } from './constants';

type UserProfileType = {
  picture?: string;
  description?: object[];
  sectors?: string;
  skills?: string;
  socials?: string;
};

export type UserType = {
  username: string;
  realname: string | null;
  profile: UserProfileType;
};

export const UsersFilter = Recoil.selector<UserType[]>({
  key: 'UsersFilter',
  get: async ({ get }) => {
    const query = get(SearchQueryAtom);
    return query.length
      ? await request<UserType[]>(
          `${host}/${apis.version}/find/${routes.user}/?query=${String(query)}`,
        ).then(
          (data) => data.slice(0, limitSearchMax),
          (reason) => {
            throw reason;
          },
        )
      : new Promise((resolve) => resolve([] as UserType[]));
  },
});

export const UserInfo = Recoil.selectorFamily<
  UserType | undefined,
  string | undefined
>({
  key: 'UserInfo',
  get: (username) => async () => {
    return username
      ? await request<UserType>(
          `${host}/${apis.version}/get/${routes.user}/?username=${String(
            username,
          )}`,
        ).then(
          (data) => data,
          (reason) => {
            throw reason;
          },
        )
      : new Promise((resolve) => resolve());
  },
});

export function isUserType(obj: any) {
  return typeof obj === 'object' && 'username' in obj;
}
