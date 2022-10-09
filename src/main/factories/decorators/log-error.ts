import { LogErrorDecorator } from '../../decorators/log-error';
import { LogMongoRepository } from '../../../infra/db/mongodb/logger-repository/log';
import { Controller } from '../../../presentation/protocols';

export const makeLogErrorDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository();
  return new LogErrorDecorator(controller, logMongoRepository);
};
