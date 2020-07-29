import Recoil from 'recoil';
import { UserType, isUserType } from './user';
import { request } from './request';
import { routes, getRoute } from '../../constants';

const atomTrigger = Recoil.atom({
  key: 'authTrigger',
  default: 0,
});

export const authState = Recoil.selector<UserType | undefined>({
  key: 'authState',
  get: async ({ get }) => {
    get(atomTrigger);
    return await request<UserType>(getRoute(routes.auth.status)).then(
      (data) => data,
      (reason) => {
        return reason;
      },
    );
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue || isUserType(value)) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});
