import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { routes } from 'src/shared/constants/routes';

const Routes = () => {
  return (
    <Switch>
      {routes.map(({ path, Component, exact = false }) => {
        return (
          <Route key={path} path={path} exact={exact} render={Component} />
        );
      })}
    </Switch>
  );
};

export default Routes;
