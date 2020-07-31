import Recoil from 'recoil';
import { request } from './request';
import { DialogIdType, currentDialogIdState } from './dialog';
import { routes, getRoute } from '../../constants';

export type MessageType = {
  dialog_id: DialogIdType;
  created_at: string;
  owner: string;
  body: string;
};

export type MessagesType = {
  [key: string]: MessageType[];
};

const atomTrigger = Recoil.atom({
  key: 'messagesTrigger',
  default: 0,
});

export const messagesState = Recoil.selector<MessageType[] | undefined>({
  key: 'messagesState',
  get: async ({ get }) => {
    get(atomTrigger); // 'register' as a dependency
    const id = get(currentDialogIdState);
    return id
      ? await request<MessageType[]>(
          getRoute(`find/${routes.messages}/?dialog_id=${id}`),
        ).then(
          (data) => data,
          (reason) => {
            throw reason;
          },
        )
      : undefined;
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(atomTrigger, (v) => v + 1);
    }
  },
});
