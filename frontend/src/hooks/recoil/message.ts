import Recoil from 'recoil';
import { request } from './request';
import { DialogIdType } from './dialog';
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

export const DialogIdState = Recoil.atom<string | undefined>({
  key: 'DialogIdState',
  default: undefined,
});

const messagesTrigger = Recoil.atom({
  key: 'messagesTrigger',
  default: 0,
});

export const MessagesState = Recoil.selector<MessageType[] | undefined>({
  key: 'MessagesState',
  get: async ({ get }) => {
    get(messagesTrigger); // 'register' as a dependency
    const id = get(DialogIdState);
    return await request<MessageType[]>(
      `${host}/${apis.version}/find/${routes.messages}/?dialog_id=${id}`,
    ).then(
      (data) => data,
      (reason) => {
        throw reason;
      },
    );
  },
  set: ({ set }, value) => {
    if (value instanceof Recoil.DefaultValue) {
      set(messagesTrigger, (v) => v + 1);
    }
  },
});

// export const MessagesInfo = selectorFamily<
//   MessageType[] | undefined,
//   string | undefined
// >({
//   key: 'MessagesInfo',
//   get: (dialog_id) => async () => {
//     return dialog_id
//       ? await request<MessageType[]>(
//           `${host}/${apis.version}/find/${routes.messages}/?dialog_id=${dialog_id}`,
//         ).then(
//           (data) => data,
//           (reason) => {
//             throw reason;
//           },
//         )
//       : new Promise((resolve) => resolve([]));
//   },
// });
