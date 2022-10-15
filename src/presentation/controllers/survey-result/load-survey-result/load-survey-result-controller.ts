import {
  CheckSurveyById,
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResult
} from './load-survey-result-controller-protocols';
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const surveyExists = await this.checkSurveyById.checkById(surveyId);
      if (!surveyExists) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId);
      return ok(surveyResult);
    } catch (e) {
      return serverError(e);
    }
  }
}
