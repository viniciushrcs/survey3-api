import { HttpResponse } from '../../protocols';
import { ServerError, UnauthorizedError } from '../../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 400,
  body: new UnauthorizedError()
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});