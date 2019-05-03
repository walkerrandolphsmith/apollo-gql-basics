import React from 'react';
import { Mutation } from 'react-apollo';
import mutation from './SignOut.mutation';
import SignOut from './SignOut.component';
import { ROOT } from 'src/shared/constants/routes';
import { navigateTo } from 'src/shared/utils/navigateTo';
import refetchQuery from 'src/shared/components/Navigation/Navigation.query';

export default props => (
  <Mutation
    mutation={mutation}
    onCompleted={data => {
      localStorage.removeItem('JWT');
      navigateTo(ROOT, props.history);
    }}
    refetchQueries={() => [
      {
        query: refetchQuery,
        variables: {},
      },
    ]}
  >
    {mutate => {
      return <SignOut handleSignOut={mutate} />;
    }}
  </Mutation>
);
