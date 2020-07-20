import { useEffect } from 'react';
import { atom, RecoilState, useSetRecoilState } from 'recoil';

export interface ResponseError extends Error {
  error: string;
  statusCode: number;
  message: string;
}

export type StoreValueType<T> = {
  isPending: boolean;
  updatedAt?: Date;
  data?: T | undefined;
  error?: ResponseError;
};

export const ErrorAtom = atom<StoreValueType<ResponseError>>({
  key: 'error',
  default: {
    isPending: false,
    data: undefined,
  },
});

export const request = <T>(
  input: RequestInfo,
  init?: RequestInit | undefined,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch(input, {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      ...init,
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json() as Promise<T>;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const error = new Error() as ResponseError;
          error.statusCode = response.status;
          error.message = error.error = response.statusText;
          return new Promise((resolve, reject) => reject(error)) as Promise<T>;
        }
        if (response.ok) {
          return response.json() as Promise<T>;
        } else {
          return new Promise((resolve, reject) =>
            reject(new Error('Bad request')),
          ) as Promise<T>;
        }
      })
      .then((data) => {
        if ('statusCode' in data) {
          return reject(data);
        }
        return resolve(data);
      }, reject)
      .catch(reject);
  });
};

export const useRecoilStore = <T>(
  atom: RecoilState<StoreValueType<T>>,
  input: RequestInfo | undefined,
  init?: RequestInit | undefined,
) => {
  const setRecords = useSetRecoilState(atom);
  // const setError = useSetRecoilState(ErrorAtom);

  useEffect(() => {
    if (input) {
      setRecords((prev) => ({ ...prev, isPending: true }));
      request<T>(input, init).then(
        // onfulfilled
        (data) => setRecords({ isPending: false, data, updatedAt: new Date() }),
        // onrejected
        (reason) => {
          // setError(reason);
          setRecords({
            isPending: false,
            data: undefined,
            error: reason,
            updatedAt: new Date(),
          });
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, init]);
};
