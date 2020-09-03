import Recoil from 'recoil';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { limitFetchMax } from './constants';
import { UserType } from './user';
import { idType } from '../../types';
import { MemberRoleType } from './member';

export declare type DialogIdType = idType;

export type DialogProfileType = {
  picture?: string;
  title?: string;
  description?: string;
};

export type DialogSettingsType = {
  mute?: boolean;
};

export type DialogType = {
  id: DialogIdType;
  dialog_type: 'direct' | 'group';
  created_at: string;
  last_message_body: string;
  last_message_created_at: string;
  last_message_owner: string;
  profile: DialogProfileType;
  settings: DialogSettingsType;
  member_count: number;
  unread_count: number;
  unread_cursor: number;
};

export function instanceOfDialog(o: any): o is DialogType {
  return o && 'id' in o && 'dialog_type' in o;
}

export const currentDialogIdState = Recoil.atom<DialogIdType | undefined>({
  key: 'current-dialog-id',
  default: undefined,
});

export const dialogsOffsetAtom = Recoil.atom<number>({
  key: 'dialogs-offset',
  default: 0,
});

const dialogsVersion = Recoil.atom({
  key: 'dialogs-version',
  default: 0,
});

export type DialogIdsType = {
  id: DialogIdType;
};

const dialogsByOffset = Recoil.selectorFamily<DialogIdsType[], number>({
  key: 'dialog-ids-by-offset',
  get: (offset) => async ({ get }) => {
    get(dialogsVersion); // 'register' as a resetable dependency
    return await request<DialogIdsType[]>(
      getRoute(`find/${routes.dialogs}/?offset=${offset}`),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as DialogIdsType[])),
      (reason) => {
        throw reason;
      },
    );
  },
  set: (offset) => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(dialogsVersion, (v) => v + 1);
    }
  },
});

export const dialogsState = Recoil.selector<DialogIdsType[]>({
  key: 'dialog-ids-state',
  get: async ({ get }) => {
    get(dialogsVersion); // 'register' as a resetable dependency
    const offset = get(dialogsOffsetAtom);
    let records = [] as DialogIdsType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(get(dialogsByOffset(index)));
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(dialogsVersion, (v) => v + 1);
    }
  },
});

const dialogVersion = Recoil.atomFamily({
  key: 'dialog-version',
  default: 0,
});

export const dialogSelector = Recoil.selectorFamily<
  DialogIdsType[] | undefined,
  DialogIdType
>({
  key: 'dialog-selector',
  get: (id) => async ({ get }) => {
    if (!id) return;
    get(dialogVersion(id));
    return await request<DialogIdsType[]>(
      getRoute(`get/${routes.dialogs}/?id=${id}`),
    ).then(
      (data) => data,
      (reason) => {
        throw reason;
      },
    );
  },
  set: (id) => ({ set }, value) => {
    if (!id) return;
    if (value instanceof Recoil.DefaultValue) {
      set(dialogVersion(id), (v) => v + 1);
    }
  },
});

const dialogMembersVersion = Recoil.atom({
  key: 'dialog-members-version',
  default: 0,
});

export const dialogMembersOffsetAtom = Recoil.atom<number>({
  key: 'dialog-members-offset',
  default: 0,
});

type DialogMembersParamsType = {
  dialog_id: DialogIdType;
  offset: number;
};

export type DialogMemberType = UserType & {
  dialog_id: DialogIdType;
  role: MemberRoleType;
};

export const dialogMembersSelector = Recoil.selectorFamily<
  DialogMemberType[],
  DialogMembersParamsType
>({
  key: 'dialog-members-selector',
  get: ({ dialog_id, offset }) => async ({ get }) => {
    get(dialogMembersVersion); // 'register' as a resetable dependency
    return await request<DialogMemberType[]>(
      getRoute(
        `find/${routes.members}/?dialog_id=${dialog_id}&offset=${offset}`,
      ),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as DialogMemberType[])),
      (reason) => {
        throw reason;
      },
    );
  },
  set: () => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(dialogMembersVersion, (v) => v + 1);
    }
  },
});

export const dialogMembersState = Recoil.selector<DialogMemberType[]>({
  key: 'dialog-members-state',
  get: async ({ get }) => {
    get(dialogMembersVersion); // 'register' as a resetable dependency
    const dialog_id = get(currentDialogIdState);
    if (!dialog_id) {
      return [] as DialogMemberType[];
    }
    const offset = get(dialogMembersOffsetAtom);
    let records = [] as DialogMemberType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(
        get(dialogMembersSelector({ dialog_id, offset: index })),
      );
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(dialogMembersVersion, (v) => v + 1);
    }
  },
});
