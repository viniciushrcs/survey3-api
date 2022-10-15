import { gql } from 'apollo-server-express';

export default gql`
  type SurveyAnswer {
    image: String
    answer: String!
  }
`;
