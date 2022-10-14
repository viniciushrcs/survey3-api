import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys
} from './load-surveys-protocols';
import { noContent, ok, serverError } from '../../../helpers/http/http-helper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.userId);
      return surveys.length ? ok(surveys) : noContent();
    } catch (e) {
      return serverError(e);
    }
  }
}
