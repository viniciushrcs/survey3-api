import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    signUp(
      name: String!
      email: String!
      password: String!
      passwordConfirmation: String!
    ): Account!
  }
`;
