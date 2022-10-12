import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';

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
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepository } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(
      loadSurveyResultRepository,
      'loadBySurveyId'
    );
    await sut.load('any_survey_id');
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
