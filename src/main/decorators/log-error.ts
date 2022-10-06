import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';

//todo tentar implementar o decorator do modo novo, usando o @decorator

export class LogErrorDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logger: LogErrorRepository;
  private readonly serverErrorStatusCode = 500;

  constructor(controller: Controller, logger: LogErrorRepository) {
    this.controller = controller;
    this.logger = logger;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === this.serverErrorStatusCode) {
      await this.logger.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
