import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorPage from '../error/index';
import { routes } from '../../constants';

const IndexPage = () => (
  <React.Suspense fallback={null}>
    <Switch>
      <Route
        path={`/${routes.auth.signin}/`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './signin'),
        )}
      />
      <Route
        path={`/${routes.auth.signup}/`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './signup'),
        )}
      />
      <Route
        path={`/${routes.auth.signout}/`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './signout'),
        )}
      />
      <Route
        path={`/${routes.auth.reset}/:id`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './reset'),
        )}
      />
      <Route
        path={`/${routes.auth.reset}/`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './reset'),
        )}
      />
      <Route
        path={`/${routes.auth.verify}/:id`}
        component={React.lazy(() =>
          import(/* webpackMode: "eager" */ './verify'),
        )}
      />
      <Route path="/auth" component={ErrorPage} />
    </Switch>
  </React.Suspense>
);

export default IndexPage;
