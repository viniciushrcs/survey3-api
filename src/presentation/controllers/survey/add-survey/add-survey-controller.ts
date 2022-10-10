import {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './add-survey-protocols';
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http/http-helper';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({ question, answers, date: new Date() });
      return noContent();
    } catch (e) {
      return serverError(e);
    }
  }
}
