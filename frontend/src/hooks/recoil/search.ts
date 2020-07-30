import { atom } from 'recoil';

export const searchQueryAtom = atom<string>({
  key: 'searchQuery',
  default: '',
});

export const searchSettingsQueryAtom = atom<string>({
  key: 'searchSettingsQuery',
  default: '',
});
