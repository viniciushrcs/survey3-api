import { DbLoadSurveys } from './db-load-surveys';
import {
  LoadSurveysRepository,
  SurveyModel
} from './db-load-surveys-protocols';
import MockDate from 'mockdate';

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }
];

const makeLoadSurveyRepositoryStub = () => {
  class LoadSurveyRepositoryStub implements LoadSurveysRepository {
    async loadAll(userId: string): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }
  return new LoadSurveyRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveyRepositoryStub: LoadSurveysRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub();
  const sut = new DbLoadSurveys(loadSurveyRepositoryStub);
  return {
    sut,
    loadSurveyRepositoryStub
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll');
    await sut.load('any_user_id');
    expect(loadAllSpy).toHaveBeenCalledWith('any_user_id');
  });

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyRepositoryStub, 'loadAll')
      .mockRejectedValueOnce(() => {
        throw new Error();
      });
    const promise = sut.load('any_user_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load('any_user_id');
    expect(surveys).toEqual(makeFakeSurveys());
  });
});
