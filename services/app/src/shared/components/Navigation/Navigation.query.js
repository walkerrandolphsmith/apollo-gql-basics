import gql from 'graphql-tag';

export default gql`
  query NavigationQuery {
    me {
      id
      username
    }
  }
`;
