import React, { useState, useEffect } from 'react';
import { useFetch } from 'react-async';
import { useTranslation } from 'react-i18next';
import IChevronLeft from '@material-ui/icons/ChevronLeft';

import { host, apis, routes } from '../../constants';
import { onReject } from '../../utils';
import Overlay from '../../components/Overlay';

const EmailVerify = ({
  history,
  match: {
    params: { id: verificationCode },
  },
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const { data, isPending, run } = useFetch(
    // send credentials
    `${host}/${apis.version}/${routes.auth.reset}`,
    { headers: { accept: 'application/json' } },
    {
      defer: true,
      onReject: reason => {
        onReject(reason, setError);
      },
      onResolve: () => {
        setError();
      },
    },
  );

  // didMount
  useEffect(() => {
    if (
      verificationCode &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        verificationCode,
      )
    ) {
      run({
        resource: `${host}/${apis.version}/${routes.auth.verify}/?code=${verificationCode}`,
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (verificationCode && !isPending && !error && data) {
      if ('username' in data) {
        setSuccess(true);
      }
    }
    // eslint-disable-next-line
  }, [data]);

  // Components

  const verificationSuccess = (
    <div className="card">
      <div className="card-header pl-0">
        <div className="float-left border-right">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              history.goBack();
            }}
            className="btn btn-outline-secondary border-0 ml-2 mr-2"
          >
            <IChevronLeft />
          </button>
        </div>
        <h5 className="float-left ml-4 pt-2 pb-0">
          {t('Verification process')}
        </h5>
      </div>
      <div className="card-body">
        <div className="alert alert-warning mb-0">
          <h5 className="alert-heading">{t('Email address verified')}</h5>
          {t('Thanks for verifying your email address.')}
        </div>
      </div>
    </div>
  );

  const componentError = error &&
    error.body &&
    error.body.errors &&
    Array.isArray(error.body.errors) && (
      <div className="alert alert-danger mb-0">
        {error.body.errors.map(({ message }, mi) => (
          <p className="m-0" key={`form-error-message-${mi}`}>
            {message}
          </p>
        ))}
      </div>
    );

  const componentOverlay = (
    <div className="card">
      <div className="card-header pl-0">
        <div className="float-left border-right">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              history.goBack();
            }}
            className="btn btn-outline-secondary border-0 ml-2 mr-2"
          >
            <IChevronLeft />
          </button>
        </div>
        <h5 className="float-left ml-4 pt-2 pb-0">{t('Verify email')}</h5>
      </div>
      <div className="card-body">{error ? componentError : <Overlay />}</div>
    </div>
  );

  return (
    <div className="col mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col col-md-5">
          {success ? verificationSuccess : componentOverlay}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
