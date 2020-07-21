import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import ErrorBoundary from './ErrorBoundary';
import { useRecoilStore } from './hooks/recoil/request';
import { AuthAtom } from './hooks/recoil/auth';
import { UserType } from './hooks/recoil/user';
import { getRoute, routes } from './constants';
import Overlay from './components/Overlay';
import ErrorPage from './pages/error/index';
import Notifications from './components/Notifications';
import { useTranslation } from 'react-i18next';
import PageAuth from './pages/auth/index';
import PageDialogs from './pages/dialogs/index';

type PrivateRoutePropsType = {
  isAuthorized: boolean;
  path?: string | string[];
  children: JSX.Element;
};
const PrivateRoute = ({
  isAuthorized,
  children,
  ...props
}: PrivateRoutePropsType) => (
  <Route
    {...props}
    render={({ location }) =>
      isAuthorized ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/' + routes.auth.signin,
            state: { from: location },
          }}
        />
      )
    }
  />
);

const App: React.FC = () => {
  const { t } = useTranslation();
  useRecoilStore<UserType>(AuthAtom, getRoute(routes.auth.status));
  const [auth] = useRecoilState(AuthAtom);
  const isAuthorized = 'data' in auth && auth.data !== undefined;

  if (auth.isPending || !('data' in auth)) {
    return <Overlay />;
  }
  return (
    <ErrorBoundary>
      {auth.error && auth.error.statusCode === 404 && (
        <Notifications
          toasts={[
            {
              header: { title: t('Error') },
              body: t('Auth provider is not available now'),
            },
          ]}
        />
      )}
      <BrowserRouter>
        <React.Suspense fallback={null}>
          <Switch>
            <PrivateRoute
              isAuthorized={isAuthorized}
              path={'/' + routes.dialogs}
            >
              <PageDialogs />
            </PrivateRoute>
            <Route path={'/' + routes.auth.index} component={PageAuth} />
            <Route
              exact
              path={'/'}
              render={({ location }) => (
                <Redirect
                  to={{
                    pathname:
                      '/' +
                      (isAuthorized ? routes.dialogs : routes.auth.signin),
                    state: { from: location },
                  }}
                />
              )}
            />
            <Route component={ErrorPage} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
