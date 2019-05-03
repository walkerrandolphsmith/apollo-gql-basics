import gql from 'graphql-tag';

export default gql`
  query MessagesQuery {
    messages(cursor: 0, limit: 100) {
      edges {
        id
        text
      }
    }
  }
`;
