import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './add-survey-protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validate: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.validate.validate(httpRequest.body);
    return null;
  }
}
