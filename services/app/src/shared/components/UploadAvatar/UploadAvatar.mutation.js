import gql from 'graphql-tag';

export default gql`
  mutation($file: Upload!) {
    uploadAvatar(file: $file) {
      userId
      avatarPath
      qrCodePath
    }
  }
`;
