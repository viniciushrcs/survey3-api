import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    login(email: String!, password: String!): Account!
  }
`;
