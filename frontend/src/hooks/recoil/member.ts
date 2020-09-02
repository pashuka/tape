import Recoil from 'recoil';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { DialogIdType } from './dialog';
import { UserType } from './user';
import { limitFetchMax } from './constants';
import { idType } from '../../types';

export type MemberType = UserType & {
  dialog_id: DialogIdType;
};

export type MemberRoleType = 'member' | 'admin';

export type MemberInfoType = {
  dialog_id: DialogIdType;
  unread_count: number;
  unread_cursor: idType;
  role: MemberRoleType;
  user_id: idType;
};

export function instanceOfMember(o: any): o is MemberType {
  return o && 'dialog_id' in o && 'username' in o;
}

const membersVersion = Recoil.atom({
  key: 'members-version',
  default: 0,
});

export const membersOffsetAtom = Recoil.atom<number>({
  key: 'members-offset',
  default: 0,
});

export const membersByOffset = Recoil.selectorFamily<MemberType[], number>({
  key: 'members-by-offset',
  get: (offset) => async () => {
    return await request<MemberType[]>(
      getRoute(`find/${routes.members}/?offset=${offset}`),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as MemberType[])),
      (reason) => {
        throw reason;
      },
    );
  },
});

export const membersState = Recoil.selector<MemberType[]>({
  key: 'members-state',
  get: async ({ get }) => {
    get(membersVersion); // 'register' as a resetable dependency
    const offset = get(membersOffsetAtom);
    let records = [] as MemberType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(get(membersByOffset(index)));
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(membersVersion, (v) => v + 1);
    }
  },
});
