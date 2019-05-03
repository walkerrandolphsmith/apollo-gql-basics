import gql from 'graphql-tag';

export default gql`
  mutation Post($text: String!) {
    createMessage(text: $text) {
      id
      text
      author {
        username
      }
    }
  }
`;
