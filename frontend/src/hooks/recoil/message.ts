import Recoil from 'recoil';
import { request } from './request';
import { DialogIdType, currentDialogIdState } from './dialog';
import { routes, getRoute } from '../../constants';
import { limitFetchMax } from './constants';
import { idType } from '../../types';

export type MessageType = {
  id: idType;
  dialog_id: DialogIdType;
  created_at: string;
  owner: string;
  body: string;
};

export function instanceOfMessage(o: any): o is MessageType {
  return o && 'id' in o && 'dialog_id' in o;
}

const messagesVersion = Recoil.atom({
  key: 'messages-version',
  default: 0,
});

export const messagesOffsetAtom = Recoil.atom<number>({
  key: 'messages-offset',
  default: 0,
});

type OffsetType = {
  dialog_id: string;
  offset: number;
};

const messagesByOffset = Recoil.selectorFamily<MessageType[], OffsetType>({
  key: 'messages-by-offset',
  get: ({ dialog_id, offset }) => async ({ get }) => {
    get(messagesVersion); // 'register' as a resetable dependency
    return await request<MessageType[]>(
      getRoute(
        `find/${routes.messages}/?dialog_id=${dialog_id}&offset=${offset}`,
      ),
    ).then(
      (data) => (Array.isArray(data) ? data.reverse() : ([] as MessageType[])),
      (reason) => {
        throw reason;
      },
    );
  },
  set: (offset) => ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(messagesVersion, (v) => v + 1);
    }
  },
});

export const messagesState = Recoil.selector<MessageType[]>({
  key: 'messages-state',
  get: async ({ get }) => {
    get(messagesVersion); // 'register' as a resetable dependency
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
      set(messagesVersion, (v) => v + 1);
    }
  },
});

export const lastReadMessage = Recoil.selector<MessageType | undefined>({
  key: 'last-read-message',
  get: async ({ get }) => {
    const dialog_id = get(currentDialogIdState);
    if (!dialog_id) {
      return undefined;
    }
    const messages = get(messagesByOffset({ dialog_id, offset: 0 }));
    const { [messages.length - 1]: lastRecord } = messages;
    return lastRecord;
  },
});
