import { useEffect, useRef, useState } from 'react';
import Recoil from 'recoil';
import { routes, getRoute } from '../../constants';
// import { tryParseJSON } from '../../utils';
import { messagesState, messagesOffsetAtom } from './message';
import { dialogsState } from './dialog';
import { userInfoQuery, UserType } from './user';
import { tryParseJSON } from '../../utils';
import EventSource from 'eventsource';

type tapeEventType =
  | 'message_changed'
  | 'message_created'
  | 'message_removed'
  | 'user_info_changed'
  | 'user_online'
  | 'user_offline'
  | 'user_typing';

const subscribe = (
  es: EventSource | null,
  type: tapeEventType,
  listener: (event: any) => void,
) => es?.addEventListener(type, listener);

const unsubscribe = (
  es: EventSource | null,
  type: tapeEventType,
  listener: (event: any) => void,
) => es?.removeEventListener(type, listener);

type EventSourceConstructor = {
  new (url: string, eventSourceInitDict?: EventSourceInit): EventSource;
};

export type EventSourceStatus = 'init' | 'open' | 'closed' | 'error';

export type EventSourceEvent = Event & { data: string };

export function useTapeEvents(
  EventSourceInstance: EventSourceConstructor = EventSource,
) {
  const source = useRef<EventSource | null>(null);
  const [status, setStatus] = useState<EventSourceStatus>('init');

  const resetMessages = Recoil.useResetRecoilState(messagesState);
  const resetMessagesOffset = Recoil.useResetRecoilState(messagesOffsetAtom);
  const resetDialogs = Recoil.useResetRecoilState(dialogsState);
  const resetUserInfo = Recoil.useRecoilCallback(
    ({ reset }) => async (username: string) => {
      reset(userInfoQuery({ username }));
    },
  );

  useEffect(() => {
    // TODO: add client version headers
    const es = new EventSourceInstance(getRoute(routes.events), {
      withCredentials: true,
    });
    source.current = es;

    es.addEventListener('open', () => setStatus('open'));
    es.addEventListener('error', () => setStatus('error'));

    return () => {
      source.current = null;
      es.close();
    };
  }, [EventSourceInstance]);

  const messageCreatedListener = function (ev: any) {
    resetMessages();
    resetMessagesOffset();
    resetDialogs();
  };

  const userInfoListener = function (ev: any) {
    const event = tryParseJSON(ev.data);
    if ('username' in event) {
      const user = event as UserType;
      resetUserInfo(user.username);
    }
  };

  // Predefine processing tape events
  useEffect(() => {
    subscribe(source.current, 'message_created', messageCreatedListener);
    subscribe(source.current, 'user_info_changed', userInfoListener);

    return () => {
      unsubscribe(source.current, 'message_created', messageCreatedListener);
      unsubscribe(source.current, 'user_info_changed', userInfoListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return [source.current, status] as const;
}

export function useTapeEventsListener(
  source: EventSource | null,
  types: string[],
  listener: (e: EventSourceEvent) => void,
  dependencies: any[] = [],
) {
  useEffect(() => {
    if (source) {
      types.forEach((type) => source.addEventListener(type, listener as any));
      return () =>
        types.forEach((type) =>
          source.removeEventListener(type, listener as any),
        );
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, ...dependencies]);
}
