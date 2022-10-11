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
      const {
        params: { surveyId },
        body: { answer }
      } = httpRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map((answer) => answer.answer);
        const isAnswerValid = answers.includes(answer);
        if (!isAnswerValid) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return null;
    } catch (e) {
      return serverError(e);
    }
  }
}
