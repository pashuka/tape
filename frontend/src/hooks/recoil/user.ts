import { atom } from "recoil";
import { StoreValueType } from "./request";

export type UserProfileType = {
  picture?: string;
  description?: object[];
  sectors?: string;
  skills?: string;
  socials?: string;
};

export type UserType = {
  username: string;
  realname: string | null;
  profile: UserProfileType;
};

export const UsersAtom = atom<StoreValueType<UserType[]>>({
  key: "users",
  default: {
    isPending: false,
    data: [] as UserType[],
  },
});
