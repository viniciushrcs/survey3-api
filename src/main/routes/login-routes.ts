import { Router } from 'express';
import { makeSignUpController } from '../factories/signup/signup';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeLoginController } from '../factories/login/login';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
