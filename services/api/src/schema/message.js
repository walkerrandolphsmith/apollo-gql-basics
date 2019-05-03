import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(cursor: Int, limit: Int): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Message!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

  type Message {
    id: ID!
    text: String!
    author: User!
    createdAt: String!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
