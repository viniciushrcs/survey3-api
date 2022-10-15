import { gql } from 'apollo-server-express';

export default gql`
  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Int!
  }
`;
