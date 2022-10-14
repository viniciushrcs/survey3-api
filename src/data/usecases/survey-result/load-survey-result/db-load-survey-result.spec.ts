import {
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';
import MockDate from 'mockdate';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '../../../../domain/models/survey';

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepository: LoadSurveyResultRepository;
  loadSurveyByIdRepository: LoadSurveyByIdRepository;
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

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

const makeSaveSurveyEmptyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 0,
      percent: 0
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
  const loadSurveyByIdRepository = makeLoadSurveyByIdRepositoryStub();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepository,
    loadSurveyByIdRepository
  );
  return {
    sut,
    loadSurveyResultRepository,
    loadSurveyByIdRepository
  };
};

describe('LoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('LoadSurveyResultRepository', () => {
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

    test('Should call LoadSurveyByIdRepository with correct values LoadSurveyResultRepository returns null', async () => {
      const { sut, loadSurveyResultRepository, loadSurveyByIdRepository } =
        makeSut();
      jest
        .spyOn(loadSurveyResultRepository, 'loadBySurveyId')
        .mockResolvedValueOnce(null);
      const loadByIdSpy = jest.spyOn(loadSurveyByIdRepository, 'loadById');
      await sut.load('any_survey_id');
      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
    });

    test('Should return all surveys with count 0 if LoadSurveyResult returns null', async () => {
      const { sut, loadSurveyResultRepository } = makeSut();
      jest
        .spyOn(loadSurveyResultRepository, 'loadBySurveyId')
        .mockResolvedValueOnce(null);
      const surveyResult = await sut.load('any_survey_id');
      expect(surveyResult).toEqual(makeSaveSurveyEmptyResultModel());
    });

    test('Should return surveyResultModel on success', async () => {
      const { sut } = makeSut();
      const surveyResult = await sut.load('any_survey_id');
      expect(surveyResult).toEqual(makeSaveSurveyResultModel());
    });
  });
});
