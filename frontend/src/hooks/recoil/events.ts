import { useEffect, useRef, useState } from 'react';
import Recoil from 'recoil';
import { routes, getRoute } from '../../constants';
import { tryParseJSON } from '../../utils';
import { messagesState, messagesOffsetAtom } from './message';
import { dialogsState } from './dialog';

const tapeEvents = {
  message: 'new-message',
  online: 'online',
  offline: 'offline',
  typing: 'typing',
};

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

  const newMessageListener = function (ev: any) {
    // const msg = tryParseJSON(ev.data);
    // console.log('EventSource:', msg);
    resetMessages();
    resetMessagesOffset();
    resetDialogs();
  };

  // Predefine processing tape events
  useEffect(() => {
    source.current?.addEventListener(tapeEvents.message, newMessageListener);

    return () => {
      source.current?.removeEventListener(
        tapeEvents.message,
        newMessageListener,
      );
    };
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
