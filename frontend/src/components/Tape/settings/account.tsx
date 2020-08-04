import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, FetchError } from 'react-async';
import IWarning from '@material-ui/icons/Warning';

import { UserType, instanceOfUser } from '../../../hooks/recoil/user';
import { TapeErrorType, filterObject, isEmpty, onReject } from '../../../utils';
import { routes, getRoute } from '../../../constants';
import { useRecoilState } from 'recoil';
import { authState } from '../../../hooks/recoil/auth';

const schema = {
  username: { type: 'text' },
};

type PropsType = {
  iam: UserType;
};

const Page = ({ iam }: PropsType) => {
  const { t } = useTranslation();

  const [error, setError] = useState<TapeErrorType | undefined>();
  const [values, setValues] = useState({ username: '' });
  const [, setAuth] = useRecoilState(authState);
  const { data, isPending, run } = useFetch<UserType>(
    getRoute(`get/${routes.user}/?username=${iam.username}`),
    { headers: { accept: 'application/json' } },
    {
      defer: true,
      onReject: (reason) => {
        onReject(reason as FetchError, setError);
      },
      onResolve: () => {
        setError(undefined);
      },
    },
  );

  useEffect(() => {
    if (!isPending && !error && instanceOfUser(data)) {
      setAuth(() => data);
    }
    // eslint-disable-next-line
  }, [data, error]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 mb-4">
          <h1 className="h4 font-weight-light border-bottom pb-1 mb-4">
            {t('Change username')}
          </h1>

          {error && (
            <div className="alert alert-danger">
              {error.body &&
                error.body.errors &&
                Array.isArray(error.body.errors) &&
                error.body.errors.map(({ message }, mi) => (
                  <p className="m-0" key={`form-error-message-${mi}`}>
                    {message}
                  </p>
                ))}
            </div>
          )}

          <form>
            {/*  */}
            <div className="pb-4">
              <p className="small text-muted m-0 mb-1">
                <abbr title={t('Current User name')}>{t('Current')}</abbr>
              </p>
              <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                <input
                  className="form-control mt-1"
                  disabled={true}
                  type="text"
                  name="current-username"
                  value={iam && iam.username}
                  placeholder={t('User name')}
                />
              </div>
            </div>

            {/*  */}
            <div className="form-group">
              <p className="small text-muted m-0 mb-1">
                <abbr title={t('New User name')}>{t('New username')}</abbr>
              </p>
              <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                <input
                  className="form-control mt-1"
                  disabled={isPending}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                  type="text"
                  name="username"
                  value={values && values.username}
                  placeholder={t('Please type your new iam name')}
                />
                <small className="form-text text-danger pl-1">
                  <IWarning fontSize="small" className="mr-2" />
                  {t(
                    'Unexpected bad things will happen if you don’t read this!',
                  )}
                </small>
                <small className="form-text text-muted pl-1">
                  {t('Are you really want to change your username?')}
                </small>
                <small className="form-text text-muted pl-1">
                  <ul>
                    <li>
                      {t(
                        'We will not set up redirects for your old profile page.',
                      )}
                    </li>
                    <li>
                      {t('We will not set up redirects for other sites.')}
                    </li>
                    <li>
                      {t(
                        'Web links to your existing projects will continue to work.',
                      )}
                    </li>
                    <li>
                      {t(
                        'We recommend updating any links to your account from elsewhere, such as your LinkedIn or Twitter profile.',
                      )}
                    </li>
                  </ul>
                </small>
              </div>
            </div>
            {/* <div className="form-group">
            <fieldset className="border rounded p-2">
              <legend className="w-auto font-weight-light">
                {t("Really change your username?")}
              </legend>
            </fieldset>
          </div> */}

            <button
              type="submit"
              disabled={
                isPending ||
                (values && iam && values.username === iam.username) ||
                !values.username
              }
              onClick={() => {
                const toPut = filterObject(
                  values,
                  ([k, v]: [string, string]) =>
                    Object.keys(schema).includes(k) && v !== (iam as any)[k],
                );
                if (!isEmpty(toPut)) {
                  run({
                    resource: getRoute(
                      `put/${routes.user}/?username=${iam.username}`,
                    ),
                    method: 'PUT',
                    body: JSON.stringify(toPut),
                  });
                }
              }}
              className="btn btn-primary"
            >
              {isPending && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {t('I understand, let’s change my username')}
            </button>
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>

      <div className="row">
        <div className="col-md-8 mt-4 mb-4">
          <h1 className="h4 font-weight-light text-danger border-bottom pb-1 mb-4">
            {t('Delete account')}
          </h1>
          <button
            type="submit"
            disabled={true}
            className="btn btn-outline-danger"
          >
            {t('Delete your account')}
          </button>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
};

export default Page;
