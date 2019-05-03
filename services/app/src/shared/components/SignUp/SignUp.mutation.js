import gql from 'graphql-tag';

export default gql`
  mutation($username: String!, $password: String!, $email: String!) {
    signUp(username: $username, password: $password, email: $email) {
      token
    }
  }
`;
