import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey';
import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware';

export default (router: Router): void => {
  const authAdmin = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', authAdmin, adaptRoute(makeAddSurveyController()));
};
