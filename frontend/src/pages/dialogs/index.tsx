import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ParamsKeyUser, ParamsKeyDialog, routes } from '../../constants';
import Messenger from '../../components/Tape/index';

const IndexPage = () => (
  <Switch>
    <Route
      path={`/${routes.dialogs}/${ParamsKeyUser}/:${ParamsKeyUser}/`}
      render={() => <Messenger />}
    />
    <Route
      path={`/${routes.dialogs}/:${ParamsKeyDialog}`}
      render={() => <Messenger />}
    />
    <Route exact path={`/${routes.dialogs}/`} render={() => <Messenger />} />
  </Switch>
);

export default IndexPage;
