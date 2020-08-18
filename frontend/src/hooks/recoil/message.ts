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

type OffsetType = {
  dialog_id: string;
  offset: number;
};

const messagesByOffset = Recoil.selectorFamily<MessageType[], OffsetType>({
  key: 'messagesByOffset',
  get: ({ dialog_id, offset }) => async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    return await request<MessageType[]>(
      getRoute(
        `find/${routes.messages}/?dialog_id=${dialog_id}&offset=${offset}`,
      ),
    ).then(
      (data) => (Array.isArray(data) ? data : ([] as MessageType[])),
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

export const messagesState = Recoil.selector<MessageType[]>({
  key: 'messagesState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a resetable dependency
    const dialog_id = get(currentDialogIdState);
    if (!dialog_id) {
      return [] as MessageType[];
    }
    const offset = get(messagesOffsetAtom);
    let records = [] as MessageType[];
    for (let index = 0; index <= offset; index += limitFetchMax) {
      const recordsByOffset = get(
        messagesByOffset({ dialog_id, offset: index }),
      );
      records = recordsByOffset.concat(records);
    }
    return records;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});
