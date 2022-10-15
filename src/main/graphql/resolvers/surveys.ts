import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';
import { makeLoadSurveysController } from '../../factories/controllers/survey/load-surveys';

export default {
  Query: {
    async surveys(parent: any, args: any, context: any) {
      return adaptResolver(makeLoadSurveysController(), args, context);
    }
  }
};
