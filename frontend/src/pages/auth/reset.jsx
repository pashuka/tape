import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from 'react-async';
import { useTranslation } from 'react-i18next';
import IChevronLeft from '@material-ui/icons/ChevronLeft';
import { useRecoilValue } from 'recoil';

import { host, apis, routes } from '../../constants';
import Form from '../../components/Form/index';
import { schema } from './constants';
import { onReject } from '../../utils';
import { authState } from '../../hooks/recoil/auth';
import { instanceOfUser } from '../../hooks/recoil/user';

const ForgotPassword = ({
  history,
  match: {
    params: { id: resetCode },
  },
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState();
  const iam = useRecoilValue(authState);
  const { data, isPending, run } = useFetch(
    // send credentials
    `${host}/${apis.version}/${routes.auth.reset}`,
    { headers: { accept: 'application/json' } },
    {
      defer: true,
      onReject: (reason) => {
        onReject(reason, setError);
      },
      onResolve: () => {
        setError();
      },
    },
  );

  useEffect(() => {
    if (!isPending && !error && resetCode && data) {
      history.push(`/${routes.auth.signin}/`);
    }
    // eslint-disable-next-line
  }, [data]);

  // Components

  const resetForm = (
    <Form
      pending={isPending}
      disabled={instanceOfUser(iam)}
      title={t('Reset password')}
      schema={schema.forgot}
      warning={instanceOfUser(iam) && t('You need to sign out before')}
      errors={[error]}
      history={history}
      buttonTitle={t('Reset')}
      onSubmit={(values) => {
        const isEmpty =
          Object.entries(values).length === 0 && values.constructor === Object;
        if (!isEmpty) {
          let body = new FormData();
          for (var field in values) {
            body.append(field, values[field]);
          }
          run({
            method: 'POST',
            body, //: JSON.stringify(values)
          });
        }
      }}
    />
  );

  const resetSuccess = (
    <div className="card">
      <div className="card-header pl-0">
        <div className="float-left border-right">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              history.goBack();
            }}
            className="btn btn-outline-secondary border-0 ml-2 mr-2"
          >
            <IChevronLeft />
          </button>
        </div>
        <h5 className="float-left ml-4 pt-2 pb-0">{t('Reset password')}</h5>
      </div>
      <div className="card-body">
        <div className="alert alert-warning mb-0">
          {t(
            'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
          )}
        </div>
      </div>
    </div>
  );

  const newPasswordForm = (
    <Form
      pending={isPending}
      disabled={!!iam}
      title={t('Reset password')}
      schema={schema.reset}
      warning={iam && t('You need to sign out before')}
      errors={[error]}
      history={history}
      buttonTitle={t('Reset')}
      onSubmit={(values) => {
        const isEmpty =
          Object.entries(values).length === 0 && values.constructor === Object;
        if (!isEmpty) {
          let body = new FormData();
          for (var field in values) {
            body.append(field, values[field]);
          }
          run({
            resource: `${host}/${apis.version}/${routes.auth.reset}/?code=${resetCode}`,
            method: 'PUT',
            body,
          });
        }
      }}
    />
  );

  return (
    <div className="col mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col col-md-5">
          {resetCode
            ? newPasswordForm
            : !isPending && !error && data
            ? resetSuccess
            : resetForm}
          <div className="text-center p-2 small">
            {t('Already have a')} {t('Brand')} {t('account?')}
            <br />
            <Link className="" to={`/${routes.auth.signin}`}>
              {t('Sign in')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
