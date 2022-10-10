import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys';
import { authAdmin } from '../factories/middlewares/authAdmin';
import { auth } from '../factories/middlewares/auth';

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
