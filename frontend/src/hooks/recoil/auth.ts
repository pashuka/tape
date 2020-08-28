import Recoil from 'recoil';
import { instanceOfUser, UserNameType } from './user';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { dialogsState } from './dialog';
import { membersState } from './member';
import { messagesState } from './message';

const authVersion = Recoil.atom({
  key: 'auth-version',
  default: 0,
});

export const authState = Recoil.selector<UserNameType | undefined>({
  key: 'auth-state',
  get: async ({ get }) => {
    get(authVersion);
    const iam = await request<UserNameType>(getRoute(routes.auth.status)).then(
      (data) => (instanceOfUser(data) ? data : undefined),
      (reason) => {
        return reason;
      },
    );
    return iam;
  },
  set: ({ set, reset }, value) => {
    if (value instanceof Recoil.DefaultValue || instanceOfUser(value)) {
      reset(dialogsState);
      reset(membersState);
      reset(messagesState);
      set(authVersion, (v) => v + 1);
    }
  },
});
