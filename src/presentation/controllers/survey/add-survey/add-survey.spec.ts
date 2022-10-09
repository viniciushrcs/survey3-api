import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, Validation } from './add-survey-protocols';

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub
  };
};

describe('AddSurvey Controller', () => {
  describe.skip('AddSurvey', () => {
    // test('Should call AddSurvey with correct values', async () => {
    //   const { sut } = makeSut();
    //   const addSpy = jest.spyOn(sut, 'add');
    //   await sut.handle(makeFakeRequest());
    //   expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body);
    // });
  });

  describe('Validation', () => {
    test('Should validate obligatory data', async () => {
      const { sut, validationStub } = makeSut();
      const addSpy = jest.spyOn(validationStub, 'validate');
      await sut.handle(makeFakeRequest());
      expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body);
    });
  });
});
