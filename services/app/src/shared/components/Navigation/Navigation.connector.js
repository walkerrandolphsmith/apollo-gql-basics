import React from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router';

import query from './Navigation.query';
import Navigation from './Navigation.component';
import Loading from './Navigation.loading';

const ConnectedNavigation = () => (
  <Query query={query} fetchPolicy={'cache-first'}>
    {({ loading, data }) => {
      if (loading) return <Loading />;
      else return <Navigation me={data} />;
    }}
  </Query>
);

export default withRouter(ConnectedNavigation);
