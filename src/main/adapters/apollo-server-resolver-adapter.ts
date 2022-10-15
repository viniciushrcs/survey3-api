import { Controller } from '../../presentation/protocols';

export const adaptResolver = async (
  controller: Controller,
  args: any
): Promise<any> => {
  const httpResponse = await controller.handle({
    body: args
  });
  return httpResponse.body;
};
