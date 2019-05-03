import gql from 'graphql-tag';

export default gql`
  query MessagesQuery {
    me {
      username
      email
    }
  }
`;
