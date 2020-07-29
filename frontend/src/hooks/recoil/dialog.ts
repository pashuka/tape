import Recoil from 'recoil';
import { request } from './request';
import { SearchQueryAtom } from './search';
import { limitSearchMax } from './constants';
import { host, apis, routes } from '../../constants';

export declare type DialogIdType = string;

export type DialogProfileType = {
  picture?: string;
  title?: string;
  description?: string;
};

export type DialogType = {
  dialog_id: DialogIdType;
  participants: string[];
  last_message_body: string;
  last_message_created_at: string;
  last_message_owner: string;
  profile: DialogProfileType;
};

export const currentDialogIdState = Recoil.atom<string | undefined>({
  key: 'currentDialogIdState',
  default: undefined,
});

const atomTrigger = Recoil.atom({
  key: 'dialogsTrigger',
  default: 0,
});

export const DialogsState = Recoil.selector<DialogType[] | undefined>({
  key: 'DialogsState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a dependency
    return await request<DialogType[]>(
      `${host}/${apis.version}/findMy/${routes.dialogs}/`,
    ).then(
      (data) => data,
      (reason) => {
        throw reason;
      },
    );
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});

export const DialogsFilter = Recoil.selector({
  key: 'DialogsFilter',
  get: ({ get }) => {
    const query = get(SearchQueryAtom);
    const records = get(DialogsState);
    return query.length && records
      ? records
          .filter(({ participants }) =>
            participants.find((_) => _.includes(query)),
          )
          .slice(0, limitSearchMax)
      : ([] as DialogType[]);
  },
});
