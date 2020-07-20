import { atom } from "recoil";
import { StoreValueType } from "./request";

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

export const DialogsAtom = atom<StoreValueType<DialogType[]>>({
  key: "dialogs",
  default: {
    isPending: false,
    data: [] as DialogType[],
  },
});
