import { gql } from 'apollo-server-express';

export default gql`
  type SurveyResult {
    surveyId: String!
    question: String!
    answers: [Answer!]!
    date: DateTime!
  }
`;
