import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from 'react-async';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { routes, getRoute } from '../../constants';
import Form from '../../components/Form/index';
import { schema } from './constants';
import { onReject } from '../../utils';
import { authState } from '../../hooks/recoil/auth';
import { instanceOfUser } from '../../hooks/recoil/user';

const SignUp = ({ history }) => {
  const { t } = useTranslation();
  const [error, setError] = useState();
  const [iam, setAuth] = useRecoilState(authState);
  // const reset = useResetRecoilState(authState);
  const { data, isPending, run } = useFetch(
    // send credentials
    getRoute(`${routes.auth.signup}`),
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
    if (!isPending && instanceOfUser(data)) {
      setAuth(() => data);
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (instanceOfUser(iam)) {
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
            disabled={instanceOfUser(iam)}
            title={t('Create your account')}
            schema={schema.signup}
            warning={instanceOfUser(iam) && t('You need to sign out before')}
            errors={[error]}
            history={history}
            buttonTitle={t('Sign up')}
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
            Already have a {t('Brand')} account?
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

export default SignUp;
