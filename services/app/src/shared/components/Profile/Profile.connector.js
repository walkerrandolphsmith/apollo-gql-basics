import React from 'react';
import { Query } from 'react-apollo';

import query from './Profile.query';
import Profile from './Profile.component';
import Loading from './Profile.loading';

export default () => (
  <Query query={query} fetchPolicy={'cache-first'}>
    {({ loading, data }) => {
      if (loading) return <Loading />;
      else {
        return <Profile {...data} />;
      }
    }}
  </Query>
);
