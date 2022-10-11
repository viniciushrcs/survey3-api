import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './save-survey-result-controller-protocols';
import { forbidden, serverError } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId
      );
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return null;
    } catch (e) {
      return serverError(e);
    }
  }
}
