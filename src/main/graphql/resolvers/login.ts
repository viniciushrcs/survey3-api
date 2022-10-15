import { makeLoginController } from '../../factories/controllers/login/login';
import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';

export default {
  Query: {
    async login(_: any, args: any) {
      return adaptResolver(makeLoginController(), args);
    }
  }
};
