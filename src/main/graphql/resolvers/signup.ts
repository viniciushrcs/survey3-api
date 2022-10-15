import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter';
import { makeSignUpController } from '../../factories/controllers/signup/signup';

export default {
  Mutation: {
    async signUp(_: any, args: any) {
      return adaptResolver(makeSignUpController(), args);
    }
  }
};
