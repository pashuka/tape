import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from 'react-async';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { host, apis, routes } from '../../constants';
import Form from '../../components/Form/index';
import { schema } from './constants';
import { onReject } from '../../utils';
import { authState } from '../../hooks/recoil/auth';

const SignIn = ({ history }) => {
  const { t } = useTranslation();
  const [error, setError] = useState();

  const [iam, setAuth] = useRecoilState(authState);
  const { data, isPending, run } = useFetch(
    // send credentials
    `${host}/${apis.version}/${routes.auth.signin}`,
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
    if (!isPending && data) {
      setAuth({ isPending: false, data });
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (iam) {
      history.push('/');
    }
    // eslint-disable-next-line
  }, [iam]);

  return (
    <div className="col mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col col-md-5">
          <Form
            pending={isPending}
            disabled={!!iam}
            title={t('Sign in to') + ' ' + t('Brand')}
            schema={schema.signin}
            warning={iam && t('You need to sign out before')}
            errors={[error]}
            history={history}
            buttonTitle={t('Sign in')}
            onSubmit={(values) => {
              const isEmpty =
                Object.entries(values).length === 0 &&
                values.constructor === Object;
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
          <div className="text-center p-2 small">
            {t("If you don't have an account, please")}{' '}
            <Link to={`/${routes.auth.signup}`}>{t('Sign up')}</Link>{' '}
            {t('here')}. {t('Maybe you')}{' '}
            <Link to={`/${routes.auth.reset}`}>
              {t('forgot the password?')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
