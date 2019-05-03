import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    apiConfig: ApiConfig!
  }

  type ApiConfig {
    version: String!
    buildNumber: String!
    environment: String!
  }
`;
