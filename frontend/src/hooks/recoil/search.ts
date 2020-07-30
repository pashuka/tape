import { atom } from 'recoil';

export const searchQueryAtom = atom<string>({
  key: 'searchQuery',
  default: '',
});
