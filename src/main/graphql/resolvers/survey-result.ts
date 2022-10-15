import { makeLoadSurveyResultController } from '../../factories/controllers/survey-result/load-survey-result';
import { makeSaveSurveyResultController } from '../../factories/controllers/survey-result/save-survey-result';
import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';

export default {
  Query: {
    surveyResult: async (parent: any, args: any) =>
      adaptResolver(makeLoadSurveyResultController(), args)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) =>
      adaptResolver(makeSaveSurveyResultController(), args)
  }
};
