export interface ResponseError extends Error {
  error: string;
  statusCode: number;
  message: string;
}

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
