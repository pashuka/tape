import Recoil from 'recoil';
import { request } from './request';
import { DialogIdType, currentDialogIdState } from './dialog';
import { routes, getRoute } from '../../constants';
import { limitFetchMax } from './constants';

export type MessageType = {
  dialog_id: DialogIdType;
  created_at: string;
  owner: string;
  body: string;
};

const atomTrigger = Recoil.atom({
  key: 'messagesTrigger',
  default: 0,
});

export const messagesOffsetAtom = Recoil.atom<number>({
  key: 'messagesOffsetAtom',
  default: 0,
});

export const messagesByOffset = Recoil.selectorFamily<MessageType[], number>({
  key: 'messagesByOffset',
  get: (offset) => async ({ get }) => {
    const id = get(currentDialogIdState);
    return id
      ? await request<MessageType[]>(
          getRoute(`find/${routes.messages}/?dialog_id=${id}&offset=${offset}`),
        ).then(
          (data) => (Array.isArray(data) ? data : ([] as MessageType[])),
          (reason) => {
            throw reason;
          },
        )
      : ([] as MessageType[]);
  },
});

export const messagesState = Recoil.selector<MessageType[]>({
  key: 'messagesState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    const offset = get(messagesOffsetAtom);
    let records = [] as MessageType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      records = records.concat(get(messagesByOffset(index)));
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});
