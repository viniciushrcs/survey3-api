import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { auth } from '../factories/middlewares/auth';
import { makeLoadSurveyResultController } from '../factories/controllers/survey-result/load-survey-result';
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  );
};
