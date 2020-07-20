import { atom } from "recoil";
import { StoreValueType } from "./request";
import { DialogIdType } from "./dialog";

export type MessageType = {
  dialog_id: DialogIdType;
  created_at: string;
  owner: string;
  body: string;
};

export type MessagesType = {
  [key: string]: MessageType[];
};

export const MessagesAtom = atom<StoreValueType<MessagesType>>({
  key: "messages",
  default: {
    isPending: false,
    data: {} as MessagesType,
  },
});
