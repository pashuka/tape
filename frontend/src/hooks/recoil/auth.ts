import { atom } from 'recoil';
import { StoreValueType } from './request';
import { UserType } from './user';

export const AuthAtom = atom<StoreValueType<UserType>>({
  key: 'auth',
  default: {
    isPending: false,
  },
});
