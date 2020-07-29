import Recoil from 'recoil';
import { request } from './request';
import { DialogIdType, currentDialogIdState } from './dialog';
import { host, apis, routes } from '../../constants';

export type MessageType = {
  dialog_id: DialogIdType;
  created_at: string;
  owner: string;
  body: string;
};

export type MessagesType = {
  [key: string]: MessageType[];
};

const messagesTrigger = Recoil.atom({
  key: 'messagesTrigger',
  default: 0,
});

export const messagesState = Recoil.selector<MessageType[] | undefined>({
  key: 'messagesState',
  get: async ({ get }) => {
    get(messagesTrigger); // 'register' as a dependency
    const id = get(currentDialogIdState);
    return id
      ? await request<MessageType[]>(
          `${host}/${apis.version}/find/${routes.messages}/?dialog_id=${id}`,
        ).then(
          (data) => data,
          (reason) => {
            throw reason;
          },
        )
      : ([] as MessageType[]);
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(messagesTrigger, (v) => v + 1);
    }
  },
});
