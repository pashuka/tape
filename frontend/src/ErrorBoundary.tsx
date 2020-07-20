import React from 'react';
import { host } from './constants';
import * as Sentry from '@sentry/browser';

type ErrorBoundaryPropsType = {};

type ErrorBoundaryStateType = { error: Error | null; hasError: true | false };

class ErrorBoundary extends React.Component<
  ErrorBoundaryPropsType,
  ErrorBoundaryStateType
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { error, hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
    this.setState({ error, hasError: true });
  }

  render() {
    const { error, hasError } = this.state;
    let code = 520;
    let message = 'Unknown error';
    let details = 'Application returning unknown error';
    if (error) {
      if (error.message.startsWith('Cannot find module ', 0)) {
        code = 501;
        message = 'Not implemented';
        details =
          'Module ' +
          error.message.split('Cannot find module ')[1] +
          ' not exists';
      }
    }
    if (hasError) {
      return (
        <main className="mt-4 pt-5 container">
          <div className="row justify-content-md-center">
            <div className="col col-md-6">
              <div className="text-center">
                <div className="error mx-auto" data-text={code}>
                  {code}
                </div>
                <p className="lead text-gray-800 mb-5">{message}</p>
                <p className="text-gray-500 mb-0">{details}</p>
                <div className="alert alert-sm alert-light text-left pb-0 mt-3">
                  <p>
                    An error has occurred. Please reload the page and try again.
                  </p>
                  <p>
                    In case this problem persists, please contact our support
                    team:{' '}
                    <a
                      href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}?subject=Feedback for 
${host}&body=Application problem`}
                    >
                      {process.env.REACT_APP_CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
                <a className="btn btn-link" href="/">
                  Return to home
                </a>
              </div>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
