import Recoil from 'recoil';
import { request } from './request';
import { searchQueryAtom } from './search';
import { limitSearchMax } from './constants';
import { host, apis, routes } from '../../constants';
import { authState } from './auth';

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

export const DialogsState = Recoil.selector<DialogType[]>({
  key: 'DialogsState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a dependency
    return await request<DialogType[]>(
      `${host}/${apis.version}/findMy/${routes.dialogs}/`,
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as DialogType[])),
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
    const query = get(searchQueryAtom);
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

export type ParticipantType = {
  username: string;
  dialog_id?: DialogIdType;
};

export const dialogParticipants = Recoil.selector<ParticipantType[]>({
  key: 'dialogParticipants',
  get: ({ get }) => {
    const iam = get(authState);
    return get(DialogsState)
      .map(({ dialog_id, participants }) =>
        participants
          .filter((_) => iam?.username !== _)
          .map((_) => ({ username: _, dialog_id })),
      )
      .flat(1)
      .sort((a, b) => a.username.localeCompare(b.username));
  },
});

export const dialogParticipantsQuery = Recoil.selector<ParticipantType[]>({
  key: 'dialogParticipantsQuery',
  get: ({ get }) => {
    const query = get(searchQueryAtom).toLowerCase();
    const records = get(dialogParticipants);
    return query.length
      ? records
          .filter(({ username }) => username.indexOf(query) !== -1)
          .slice(0, limitSearchMax)
      : records;
  },
});

export const dialogParticipant = Recoil.selectorFamily<
  ParticipantType | undefined,
  string
>({
  key: 'dialogParticipant',
  get: (username) => ({ get }) => {
    return get(dialogParticipants).find((_) => _.username === username);
  },
});
