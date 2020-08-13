import Recoil from 'recoil';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { DialogIdType } from './dialog';
import { UserType } from './user';
import { limitFetchMax } from './constants';

type MemberParamsType = {
  dialog_id?: number;
  offset?: number;
};

export type MemberType = UserType & {
  dialog_id: DialogIdType;
};

export function instanceOfMember(o: any): o is MemberType {
  return o && 'dialog_id' in o && 'username' in o;
}

const atomTrigger = Recoil.atom({
  key: 'membersTrigger',
  default: 0,
});

export const membersOffsetAtom = Recoil.atom<number>({
  key: 'membersOffsetAtom',
  default: 0,
});

export const membersByOffset = Recoil.selectorFamily<MemberType[], number>({
  key: 'membersByOffset',
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
  key: 'membersState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    const offset = get(membersOffsetAtom);
    let records = [] as MemberType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(get(membersByOffset(index)));
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});

export const membersByDialog = Recoil.selectorFamily<
  MemberType[] | undefined,
  MemberParamsType
>({
  key: 'membersByDialog',
  get: ({ dialog_id, offset }) => async () => {
    return await request<MemberType[]>(
      getRoute(
        `find/${routes.members}/?dialog_id=${dialog_id}&offset=${offset}`,
      ),
    ).then(
      (data) => data,
      (reason) => {
        throw reason;
      },
    );
  },
  set: (params) => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
    console.log('newValue', value);
  },
});
