import { gql } from 'apollo-server-express';

export default gql`
  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }
`;
