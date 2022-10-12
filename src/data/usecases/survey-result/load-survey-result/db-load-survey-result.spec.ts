import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';
import MockDate from 'mockdate';

interface SutTypes {
  sut: LoadSurveyResult;
  loadSurveyResultRepository: LoadSurveyResultRepository;
}

const makeSaveSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      percent: 10
    }
  ],
  date: new Date()
});

const makeLoadSurveyResultRepository = () => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(makeSaveSurveyResultModel());
    }
  }
  return new LoadSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepository = makeLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepository);
  return {
    sut,
    loadSurveyResultRepository
  };
};

describe('LoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepository } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(
      loadSurveyResultRepository,
      'loadBySurveyId'
    );
    await sut.load('any_survey_id');
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepository } = makeSut();
    jest
      .spyOn(loadSurveyResultRepository, 'loadBySurveyId')
      .mockRejectedValueOnce(() => {
        throw new Error();
      });
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(makeSaveSurveyResultModel());
  });
});
