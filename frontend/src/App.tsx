import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import ErrorBoundary from './ErrorBoundary';
import { authState } from './hooks/recoil/auth';
import { routes } from './constants';
import Overlay from './components/Overlay';
import ErrorPage from './pages/error/index';
import PageAuth from './pages/auth/index';
import PageDialogs from './pages/dialogs/index';
import { isUserType } from './hooks/recoil/user';

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
  const { state, contents } = useRecoilValueLoadable(authState);
  const isAuthorized =
    state === 'hasValue' && contents !== undefined && isUserType(contents);

  if (state === 'loading' || contents === undefined) {
    return <Overlay />;
  }
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<Overlay />}>
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
