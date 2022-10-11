import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult
} from './save-survey-result-controller-protocols';
import { forbidden, serverError } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    readonly saveSurveyResult: SaveSurveyResult
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
        body: { answer },
        userId
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
      await this.saveSurveyResult.save({
        surveyId,
        answer,
        userId,
        date: new Date()
      });
    } catch (e) {
      return serverError(e);
    }
  }
}
