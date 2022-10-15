import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    saveSurveyResult(surveyId: String!, answer: String!): SurveyResult!
  }
`;
