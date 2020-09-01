import { atom } from 'recoil';

export type MessengerType = {
  isOpen?: boolean;
  isChatOpen?: boolean;
  isChatSideBarOpen?: boolean;
};

export const MessengerAtom = atom<MessengerType>({
  key: 'messenger',
  default: {
    isOpen: false,
    isChatOpen: false,
    isChatSideBarOpen: false,
  },
});
