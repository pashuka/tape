import Recoil from 'recoil';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { limitFetchMax } from './constants';
import { UserNameType } from './user';

export declare type DialogIdType = number;

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
  unread_count: number;
  unread_cursor: number;
};

export function instanceOfDialog(o: any): o is DialogType {
  return o && 'id' in o && 'dialog_type' in o;
}

export const currentDialogIdState = Recoil.atom<string | undefined>({
  key: 'currentDialogIdState',
  default: undefined,
});

const atomTrigger = Recoil.atom({
  key: 'dialogsTrigger',
  default: 0,
});

export const dialogsOffsetAtom = Recoil.atom<number>({
  key: 'dialogsOffsetAtom',
  default: 0,
});

export const dialogsByOffset = Recoil.selectorFamily<DialogType[], number>({
  key: 'dialogsByOffset',
  get: (offset) => async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    return await request<DialogType[]>(
      getRoute(`find/${routes.dialogs}/?offset=${offset}`),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as DialogType[])),
      (reason) => {
        throw reason;
      },
    );
  },
  set: (offset) => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});

export const dialogsState = Recoil.selector<DialogType[]>({
  key: 'dialogsState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    const offset = get(dialogsOffsetAtom);
    let records = [] as DialogType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(get(dialogsByOffset(index)));
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});

export const getDialog = Recoil.selectorFamily<
  DialogType | undefined,
  string | undefined
>({
  key: 'getDialog',
  get: (dialogID) => ({ get }) => {
    return dialogID
      ? get(dialogsState).find(({ id }) => id.toString() === dialogID)
      : undefined;
  },
});

type dialogMembersType = {
  dialog_id: DialogIdType;
  offset: number;
};

export const dialogMembersSelector = Recoil.selectorFamily<
  UserNameType[] | undefined,
  dialogMembersType
>({
  key: 'dialogMembersSelector',
  get: ({ dialog_id, offset }) => async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    return await request<UserNameType[]>(
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
  set: () => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});
