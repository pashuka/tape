import { useEffect, useRef } from 'react';
import Recoil from 'recoil';
import { routes, getRoute } from '../../constants';
import { messagesState, MessageType } from './message';
import { dialogsState, dialogSelector, DialogIdType } from './dialog';
import { userInfoQuery, UserType } from './user';
import { tryParseJSON } from '../../utils';
import { MemberInfoType } from './member';

type tapeEventType =
  | 'message_changed'
  | 'message_created'
  | 'message_removed'
  | 'dialog_changed'
  | 'dialog_member_created'
  | 'dialog_member_changed'
  | 'dialog_member_removed'
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
type EventSourceStatus = 'init' | 'open' | 'closed' | 'error';
type EventSourceEvent = Event & { data: string };

export const EventSourceStatusAtom = Recoil.atom<EventSourceStatus>({
  key: 'event-source-status',
  default: 'init',
});

export function useTapeEvents(
  EventSourceInstance: EventSourceConstructor = EventSource,
) {
  const source = useRef<EventSource | null>(null);
  const [status, setStatus] = Recoil.useRecoilState(EventSourceStatusAtom);

  const resetMessages = Recoil.useResetRecoilState(messagesState);
  const resetDialogs = Recoil.useResetRecoilState(dialogsState);
  const resetUserInfo = Recoil.useRecoilCallback(
    ({ reset }) => async (username: string) => {
      reset(userInfoQuery({ username }));
    },
  );
  const resetDialogById = Recoil.useRecoilCallback(
    ({ reset }) => async (id: DialogIdType) => {
      reset(dialogSelector(id));
    },
  );

  useEffect(() => {
    // TODO: add client version headers
    const es = new EventSourceInstance(getRoute(routes.events), {
      withCredentials: true,
    });
    source.current = es;

    es.addEventListener('open', () => setStatus('open'));
    es.addEventListener('error', () => {
      setStatus('error');
    });

    return () => {
      source.current = null;
      es.close();
      setStatus('closed');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EventSourceInstance]);

  const messagesEventListener = function (ev: any) {
    const data = tryParseJSON(ev.data);
    const record = data as MessageType;
    resetMessages();
    resetDialogs();
    resetDialogById(record.dialog_id);
  };

  const dialogChangedListener = function (ev: any) {
    const data = tryParseJSON(ev.data);
    const record = data as MemberInfoType;
    resetDialogById(record.dialog_id);
  };

  const userInfoListener = function (ev: any) {
    const event = tryParseJSON(ev.data);
    if ('username' in event) {
      const user = event as UserType;
      resetUserInfo(user.username);
    }
  };

  const memberCreatedListener = function (ev: any) {
    resetDialogs();
  };

  // Predefine processing tape events
  useEffect(() => {
    subscribe(source.current, 'message_created', messagesEventListener);
    subscribe(source.current, 'message_changed', messagesEventListener);
    subscribe(source.current, 'message_removed', messagesEventListener);
    subscribe(source.current, 'dialog_changed', dialogChangedListener);
    subscribe(source.current, 'user_info_changed', userInfoListener);
    subscribe(source.current, 'dialog_member_created', memberCreatedListener);

    return () => {
      unsubscribe(source.current, 'message_created', messagesEventListener);
      unsubscribe(source.current, 'message_changed', messagesEventListener);
      unsubscribe(source.current, 'message_removed', messagesEventListener);
      unsubscribe(source.current, 'dialog_changed', dialogChangedListener);
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

// TODO: impl reconnecting
// Maybe get implemenation from:
// https://github.com/Yaffle/EventSource

// const isFunction = (fn) => fn && {}.toString.call(fn) === "[object Function]";
// const debounce = (fn, wait) => {
//   let timeout;
//   let waitFn;

//   return function () {
//     if (isFunction(wait)) {
//       waitFn = wait;
//     } else {
//       waitFn = function () {
//         return wait;
//       };
//     }

//     var context = this,
//       args = arguments;
//     var later = function () {
//       timeout = null;
//       fn.apply(context, args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, waitFn());
//   };
// }

// let reconnectFrequencySeconds = 1;
// let evtSource;
// const urlString = ''

// var reconnect = debounce(
//   function () {
//     setupEventSource(urlString);
//     // Double delay every attempt to avoid overwhelming server
//     reconnectFrequencySeconds *= 2;
//     // Max out at ~1 minute as a compromise between user experience and server load
//     if (reconnectFrequencySeconds >= 64) {
//       reconnectFrequencySeconds = 64;
//     }
//   },
//   function () {
//     return reconnectFrequencySeconds * 1000;
//   }
// );

// function setupEventSource(url:string) {
//   evtSource = new EventSource(url);
//   evtSource.onmessage = function (e) {
//     // Handle even here
//   };
//   evtSource.onopen = function (e) {
//     // Reset reconnect frequency upon successful connection
//     reconnectFrequencySeconds = 1;
//   };
//   evtSource.onerror = function (e) {
//     evtSource.close();
//     reconnect();
//   };
// }
// setupEventSource(urlString);
