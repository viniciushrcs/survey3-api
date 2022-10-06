import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: Controller) => {
  const httpSuccessStatus = 200;
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    };
    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === httpSuccessStatus) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      });
    }
  };
};
