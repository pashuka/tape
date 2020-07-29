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
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return Promise.reject(response) as Promise<T>;
        }
        return response.json() as Promise<T>;
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
