import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!

    signIn(login: String!, password: String!): Token!

    signOut: Boolean

    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    role: String!
    username: String!
    email: String!
    name: String!
    nameFirst: String!
    nameLast: String!
    qrCode: String!
    messages: [Message!]
  }
`;
