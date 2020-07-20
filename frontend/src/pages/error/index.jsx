import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = ({ error }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center mt-5 pt-5">
      <div
        className="error mx-auto"
        data-text={(error && error.status) || '404'}
      >
        {(error && error.status) || '404'}
      </div>
      <p className="lead text-gray-800 mb-5">
        {(error && error.statusText) || t('Page not found')}
      </p>
      {error && error.statusHelper && (
        <p className="text-gray-800 mb-5">{error.statusHelper}</p>
      )}
      <Link className="btn btn-link" to="/">
        {t('Go home')} &rarr;
      </Link>
    </div>
  );
};

export default withRouter(ErrorPage);
