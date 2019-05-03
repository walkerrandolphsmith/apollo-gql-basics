import React from 'react';
import { Query } from 'react-apollo';

import query from './Messages.query';
import Messages from './Messages.component';
import Loading from './Messages.loading';

export default () => (
  <Query query={query} fetchPolicy={'network-only'}>
    {({ loading, data }) => {
      if (loading) return <Loading />;
      else {
        return (
          <Messages
            messages={data && data.messages ? data.messages : { edges: [] }}
          />
        );
      }
    }}
  </Query>
);
