import Recoil from 'recoil';
import { request } from './request';
import { searchQueryAtom } from './search';
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

export function instanceOfUser(o: any): o is UserType {
  return 'username' in o;
}

export const userInfoQuery = Recoil.selectorFamily<
  UserType | undefined,
  string | undefined
>({
  key: 'userInfoQuery',
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

export const UsersFilter = Recoil.selector<UserType[]>({
  key: 'UsersFilter',
  get: async ({ get }) => {
    const query = get(searchQueryAtom);
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
