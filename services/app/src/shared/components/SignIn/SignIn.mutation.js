import gql from 'graphql-tag';

export default gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;
