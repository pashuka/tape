import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch, FetchError } from 'react-async';
import IClose from '@material-ui/icons/Close';
import { useRecoilState } from 'recoil';

import { TapeErrorType, onReject, isEmpty, filterObject } from '../../../utils';
import { getRoute, routes } from '../../../constants';
import { UserType, instanceOfUser } from '../../../hooks/recoil/user';
import { authState } from '../../../hooks/recoil/auth';
import Figure from '../../Figure';
import Header from './header';

const schema = {
  realname: { type: 'text' },
  profile: { type: 'json' },
};

type PropsType = {
  iam: UserType;
};

const Page = ({ iam }: PropsType) => {
  const { t } = useTranslation();
  const [, setAuth] = useRecoilState(authState);

  const [error, setError] = useState<TapeErrorType | undefined>();

  const [values, setValues] = useState(iam || {});
  const onChange = ({ name, value }: { name: string; value: string }) => {
    setValues({ ...values, [name]: value });
  };

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
  }, [data]);

  const username = (values && values.username) || '';
  const realname = (values && values.realname) || username;
  const rnInitials = realname.match(/\b\w/g) || [];
  const initials = (
    (rnInitials.shift() || '') + (rnInitials.pop() || '')
  ).toUpperCase();

  if (error) {
    return null; //<ErrorPage error={error} />;
  }

  return (
    <div className="chat-body bg-white">
      <Header title={t('Public profile')} />
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="pb-4">
              <p className="small text-muted m-0 mb-1">
                <abbr title={t('Full name')}>{t('Name')}</abbr>
              </p>
              <div className={isPending ? 'w3-fadeOut' : 'w3-fadeIn'}>
                <input
                  className="form-control mt-1"
                  disabled={isPending}
                  onChange={(e) => {
                    onChange({ name: e.target.name, value: e.target.value });
                  }}
                  type="text"
                  name="realname"
                  value={values.realname || ''}
                  placeholder={t('Please type your full name')}
                />
              </div>
            </div>

            <div className="form-group">
              <small className="form-text text-muted">
                All of the fields on this page are optional and can be deleted
                at any time, and by filling them out, you're giving us consent
                to share this data wherever your user profile appears. Please
                see our{' '}
                <Link to="/documents/privacy-statement">privacy statement</Link>{' '}
                to learn more about how we use this information.
              </small>
            </div>

            <button
              type="submit"
              disabled={isPending}
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
              {t('Update profile')}
            </button>
          </div>
          <div className="col-md-3">
            <p className="small text-muted m-0 mb-1">
              <abbr title={t("User's profile Picture")}>{t('Picture')}</abbr>
            </p>
            <div className="text-center">
              <div className="card text-white border-0">
                <Figure
                  title={realname}
                  placeholder={initials}
                  caption={'@' + values.username}
                  src={
                    values.profile && values.profile.picture
                      ? `${process.env.REACT_APP_IMG_HOST}/${routes.user}/${values.profile.picture}`
                      : undefined
                  }
                />
                <div className="card-img-overlay text-left pt-2 pl-2 pr-2">
                  <div
                    className={`picture-file btn btn-sm btn-dark ${
                      isPending ? 'disabled' : ''
                    }`}
                    style={{ maxWidth: '4.25rem' }}
                  >
                    <input
                      type="file"
                      disabled={isPending}
                      className="picture-file-input"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        if (
                          e.target.type === 'file' &&
                          e.target.files &&
                          e.target.files[0]
                        ) {
                          let body = new FormData();
                          body.append('file', e.target.files[0]);

                          run({
                            resource: getRoute(
                              `picture/${routes.user}/?username=${iam.username}`,
                            ),
                            method: 'PUT',
                            body,
                          });
                        }
                      }}
                    />
                    <label className="picture-file-label text-truncate">
                      {isPending && (
                        <span className="spinner-grow spinner-grow-sm"></span>
                      )}
                    </label>
                  </div>
                  {!isPending && values.profile && values.profile.picture && (
                    <button
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!values.profile.picture) return;
                        window.confirm(t('Remove picture?')) &&
                          run({
                            resource: getRoute(
                              `picture/${routes.user}/?username=${iam.username}`,
                            ),
                            method: 'DELETE',
                          });
                      }}
                      className="btn btn-sm btn-dark float-right pl-1 pr-1"
                    >
                      <IClose fontSize="small" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
