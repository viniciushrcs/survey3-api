import { DbLoadSurveyById } from './db-load-survey-by-id';
import {
  LoadSurveyByIdRepository,
  SurveyModel
} from './db-load-survey-by-id-protocols';
import MockDate from 'mockdate';

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

const makeLoadSurveyByIdRepositoryStub = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockRejectedValueOnce(() => {
        throw new Error();
      });
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return a survey on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.loadById('any_id');
    expect(surveys).toEqual(makeFakeSurvey());
  });
});
