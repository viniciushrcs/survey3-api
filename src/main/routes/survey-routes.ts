import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
