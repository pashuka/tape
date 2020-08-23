import { FetchError } from 'react-async';

export const isEmpty = (o: object) =>
  Object.entries(o).length === 0 && o.constructor === Object;

export const filterObject = (o: object, predicate: any) =>
  Object.fromEntries(Object.entries(o).filter(predicate));

export const compactNumber = (num: number, digits: number = 0) => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const onReject = async (reason: FetchError, callback: Function) => {
  const result = {
    status: '520',
    statusText: 'Unknown error',
    body: {
      errors: [{ message: 'Server is returning an unknown error' }],
    },
  };
  try {
    let body = {
      errors: [{ message: 'Server is returning an unknown error' }],
    };
    const response = reason.response;
    if (response && response instanceof Response) {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        body = {
          errors: [{ message: await response.text() }],
        };
      } else {
        body = await response.json();
      }
      const { url, status, statusText } = response;
      callback({ url, status, statusText, body });
    } else {
      const { message, stack } = reason;
      callback({ ...result, body: { errors: [{ message, stack }] } });
    }
  } catch (e) {
    callback({ ...result, body: { errors: [{ message: e.message }] } });
  }
};

type ErrorMessageType = {
  message: string;
  field: string;
};

type ErrorBodyType = {
  errors: ErrorMessageType[];
};

export type TapeErrorType = Error & {
  readonly status: number;
  readonly statusText: string;
  readonly body: ErrorBodyType;
};

export const tryParseJSON = (s: string) => {
  try {
    const o = JSON.parse(s);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}
  return;
};
