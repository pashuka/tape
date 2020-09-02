export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export const ParamsKeyUser = 'user';
export const ParamsKeyDialog = 'dialog';
export const ParamsKeyCreateGroup = 'group';

interface ParamsInterface {
  [ParamsKeyUser]?: string;
  [ParamsKeyDialog]?: string;
  [ParamsKeyCreateGroup]?: string;
}

export declare type QSParamsType = RequireAtLeastOne<
  ParamsInterface,
  'user' | 'dialog' | 'group'
>;

export const host = process.env.REACT_APP_HOST;
export const apis = JSON.parse(process.env.REACT_APP_APIS || '');

export const routes = {
  // TODO: remove admins after migration in production
  // admins: 'admins',
  auth: {
    index: 'auth',
    signin: 'auth/signin',
    signup: 'auth/signup',
    signout: 'auth/signout',
    status: 'auth/status',
    reset: 'auth/reset',
    verify: 'auth/verify',
  },
  dialogs: 'dialogs',
  events: 'events',
  members: 'members',
  messages: 'messages',
  participants: 'participants',
  settings: {
    index: 'settings',
    profile: 'settings/profile',
    account: 'settings/account',
    security: 'settings/security',
    notifications: 'settings/notifications',
  },
  tape: 'tape',
  user: 'user',
};

export const getRoute = (segments: string) =>
  `${host}/${apis.version}/${segments}`;
