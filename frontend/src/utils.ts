import { FetchError } from 'react-async';

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
