import Recoil from 'recoil';
import { request } from './request';
import { routes, getRoute } from '../../constants';
import { limitFetchMax } from './constants';

export declare type DialogIdType = number;

export type DialogProfileType = {
  picture?: string;
  title?: string;
  description?: string;
};

export type DialogType = {
  id: DialogIdType;
  created_at: string;
  last_message_body: string;
  last_message_created_at: string;
  last_message_owner: string;
  profile: DialogProfileType;
  participants: string[];
};

export function instanceOfDialog(o: any): o is DialogType {
  return o && 'id' in o;
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
  get: (offset) => async () => {
    return await request<DialogType[]>(
      getRoute(`find/${routes.dialogs}/?offset=${offset}`),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as DialogType[])),
      (reason) => {
        throw reason;
      },
    );
  },
});

export const dialogsState = Recoil.selector<DialogType[]>({
  key: 'dialogsState',
  get: async ({ get }) => {
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

export const DialogsFilter = Recoil.selector({
  key: 'DialogsFilter',
  get: ({ get }) => {
    // const query = get(searchQueryAtom);
    // const records = get(DialogsState);
    // return query.length && records
    //   ? records
    //       .filter(({ participants }) =>
    //         participants.find((_) => _.includes(query)),
    //       )
    //       .slice(0, limitSearchMax)
    //   : ([] as DialogType[]);
    return [] as DialogType[];
  },
});
