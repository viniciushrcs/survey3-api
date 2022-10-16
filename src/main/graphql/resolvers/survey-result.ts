import { makeLoadSurveyResultController } from '../../factories/controllers/survey-result/load-survey-result';
import { makeSaveSurveyResultController } from '../../factories/controllers/survey-result/save-survey-result';
import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) =>
      adaptResolver(makeLoadSurveyResultController(), args, context)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) =>
      adaptResolver(makeSaveSurveyResultController(), args, context)
  }
};
