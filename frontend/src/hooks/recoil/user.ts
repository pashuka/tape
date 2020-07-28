import { atom, selector, selectorFamily } from 'recoil';
import { StoreValueType, request } from './request';
import { SearchQueryAtom } from './search';
import { routes, apis, host } from '../../constants';

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

export const UsersAtom = atom<StoreValueType<UserType[]>>({
  key: 'Users',
  default: {
    isPending: false,
    data: [] as UserType[],
  },
});

export const filterUsers = selector({
  key: 'filterUsers',
  get: ({ get }) => {
    const query = get(SearchQueryAtom);
    const state = get(UsersAtom);
    return query.length && state.data
      ? state.data.filter(
          ({ username, realname }) =>
            (realname && realname.includes(query)) || username.includes(query),
        )
      : ([] as UserType[]);
  },
});

export const UserInfo = selectorFamily<UserType, string | undefined>({
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
      : new Promise((resolve, reject) => reject('username is undefined'));
  },
});
