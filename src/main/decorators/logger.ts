import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { LoggerRepository } from '../../data/protocols/logger-repository';

export class LoggerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logger: LoggerRepository;
  private readonly serverErrorStatusCode = 500;

  constructor(controller: Controller, logger: LoggerRepository) {
    this.controller = controller;
    this.logger = logger;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === this.serverErrorStatusCode) {
      await this.logger.log(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
