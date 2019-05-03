import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import mutation from './SignIn.mutation';
import SignIn from './SignIn.component';
import { FEED } from 'src/shared/constants/routes';
import { navigateTo } from 'src/shared/utils/navigateTo';

export default props => (
  <Mutation
    mutation={mutation}
    variables={{ login: 'admin', password: 'admin' }}
    onCompleted={data => {
      localStorage.setItem('JWT', data.signIn.token);
      navigateTo(FEED, props.history);
    }}
  >
    {mutate => {
      return <SignIn handleSignIn={mutate} />;
    }}
  </Mutation>
);
