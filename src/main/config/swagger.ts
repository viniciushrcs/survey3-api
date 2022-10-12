import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';
import swaggerConfig from '../../../docs/swagger';

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig));
};
