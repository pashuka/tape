import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch, FetchError } from 'react-async';

import { getRoute, routes } from '../../../constants';
import { UserType, instanceOfUser } from '../../../hooks/recoil/user';
import { onReject, filterObject, isEmpty, TapeErrorType } from '../../../utils';
import Header from './header';

const schema = {
  password: '',
  password_new: '',
  password_confirm: '',
};

type PropsType = {
  iam: UserType;
};

const Page = ({ iam }: PropsType) => {
  const { t } = useTranslation();

  const [error, setError] = useState<TapeErrorType | undefined>();
  const [values, setValues] = useState(schema);
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
      setValues(schema);
    }
    // eslint-disable-next-line
  }, [data, error]);

  const updateDisabled = () => {
    const { password = '', password_new = '', password_confirm = '' } = values;

    if (password.trim().length === 0) return true;
    if (password_new.trim().length === 0) return true;
    if (password_confirm.trim().length === 0) return true;

    const same =
      password.length > 0 &&
      password_new.length > 0 &&
      password === password_new
        ? true
        : false;
    const invalid =
      password_confirm.length === 0 || password_new !== password_confirm
        ? true
        : false;

    if (same) return true;
    if (invalid) return true;

    return false;
  };

  return (
    <div className="chat-body bg-white">
      <Header title={t('Change password')} />
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8 mb-4">
            {!isPending && !error && data && (
              <div className="alert alert-success">
                <p className="m-0">
                  {t(
                    'Congratulations! Your password has been changed successfully.',
                  )}
                </p>
              </div>
            )}
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
                  <abbr title={t('Current User password')}>
                    {t('Current password')}
                  </abbr>
                </p>
                <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                  <input
                    className="form-control mt-1"
                    disabled={isPending}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                    type="password"
                    name="password"
                    value={values && values.password}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/*  */}
              <div className="pb-4">
                <p className="small text-muted m-0 mb-1">
                  <abbr title={t('Your new password')}>
                    {t('New password')}
                  </abbr>
                </p>
                <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                  <input
                    className="form-control mt-1"
                    disabled={isPending}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                    type="password"
                    name="password_new"
                    value={values && values.password_new}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/*  */}
              <div className="pb-4">
                <p className="small text-muted m-0 mb-1">
                  <abbr title={t('Confirm your new password')}>
                    {t('Confirm new password')}
                  </abbr>
                </p>
                <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                  <input
                    className="form-control mt-1"
                    disabled={isPending}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                    type="password"
                    name="password_confirm"
                    value={values && values.password_confirm}
                    autoComplete="confirm-password"
                  />
                </div>
              </div>

              <div className="form-group">
                <small className="form-text text-muted">
                  {t('Brand')}{' '}
                  {t(
                    'only inspects the password at the time you type it, and never stores the password you entered in plaintext.',
                  )}
                </small>
              </div>

              <button
                type="submit"
                disabled={isPending || updateDisabled()}
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
                {t('Update password')}
              </button>
            </form>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
