import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from '../../../protocols/db/survey/add-survey-repository';
import { AddSurveyParams } from '../../../../domain/usecases/survey/add-survey';
import MockDate from 'mockdate';

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeAddSurvey = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(survey: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub
  };
};

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('AddSurvey Repository', () => {
    test('Should call AddSurveyRepository with correct values', async () => {
      const { sut, addSurveyRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
      await sut.add(makeAddSurvey());
      expect(addSpy).toHaveBeenCalledWith({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      });
    });

    test('Should throw if AddSurveyRepository throws', async () => {
      const { sut, addSurveyRepositoryStub } = makeSut();
      jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(() => {
        throw new Error();
      });
      const promise = sut.add(makeAddSurvey());
      await expect(promise).rejects.toThrow();
    });
  });
});
