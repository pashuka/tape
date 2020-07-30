import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ParamsKeyUser, ParamsKeyDialog, routes } from '../../constants';
import Tape, { TabEnum } from '../../components/Tape/index';

const IndexPage = () => (
  <Switch>
    {/* /dialogs/... */}
    <Route
      path={`/${routes.tape}/${routes.dialogs}/${ParamsKeyUser}/:${ParamsKeyUser}/`}
      render={() => <Tape tab={TabEnum.Dialogs} />}
    />
    <Route
      path={`/${routes.tape}/${routes.dialogs}/:${ParamsKeyDialog}`}
      render={() => <Tape tab={TabEnum.Dialogs} />}
    />
    <Route
      exact
      path={`/${routes.tape}/${routes.dialogs}/`}
      render={() => <Tape tab={TabEnum.Dialogs} />}
    />

    {/* /participants/... */}
    <Route
      exact
      path={`/${routes.tape}/${routes.participants}/`}
      render={() => <Tape tab={TabEnum.Participants} />}
    />
    <Route
      path={`/${routes.tape}/${routes.participants}/${ParamsKeyUser}/:${ParamsKeyUser}/`}
      render={() => <Tape tab={TabEnum.Participants} />}
    />
    <Route
      path={`/${routes.tape}/${routes.participants}/:${ParamsKeyDialog}`}
      render={() => <Tape tab={TabEnum.Participants} />}
    />

    {/* /settings/... */}
    <Route
      exact
      path={`/${routes.tape}/${routes.settings.profile}/`}
      render={() => <Tape tab={TabEnum.Settings} />}
    />

    {/* /tape/ */}
    <Route
      exact
      path={`/${routes.tape}`}
      render={({ location }) => (
        <Redirect
          to={{
            pathname: `/${routes.tape}/${routes.dialogs}/`,
            state: { from: location },
          }}
        />
      )}
    />
  </Switch>
);

export default IndexPage;
