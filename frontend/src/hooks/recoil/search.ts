import { atom } from 'recoil';

export const SearchQueryAtom = atom<string>({
  key: 'SearchQuery',
  default: '',
});
