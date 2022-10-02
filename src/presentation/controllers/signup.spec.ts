import { SignupController } from './signup';

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', () => {
    // sut => System Under Test
    const errorCode = 400;
    const sut = new SignupController();
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(errorCode);
    expect(httpResponse.message).toEqual('Missing name param');
  });
});
