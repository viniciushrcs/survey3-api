import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';
import { makeLoginController } from '../../factories/controllers/login/login';

export default {
  Query: {
    async login(_: any, args: any) {
      return adaptResolver(makeLoginController(), args);
    }
  }
};
