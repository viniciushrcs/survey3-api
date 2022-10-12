import MockDate from 'mockdate';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  LoadSurveyResultRepository,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols';

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSurveyResultModel = (): SurveyResultModel => ({
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

const makeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
  surveyId: 'survey_id',
  userId: 'user_id',
  answer: 'any_answer',
  date: new Date()
});

const makeLoadSurveyResultModel = (): SurveyResultModel => ({
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

const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(makeLoadSurveyResultModel());
    }
  }
  return new LoadSurveyResultRepositoryStub();
};

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(surveyResult: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  );
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  };
};

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('SaveSurveyResult Repository', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
      await sut.save(makeSaveSurveyResultModel());
      expect(addSpy).toHaveBeenCalledWith(makeSaveSurveyResultModel());
    });

    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut();
      jest
        .spyOn(saveSurveyResultRepositoryStub, 'save')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.save(makeSaveSurveyResultModel());
      await expect(promise).rejects.toThrow();
    });

    test('Should return SurveyResult on success', async () => {
      const { sut } = makeSut();
      const saveResult = await sut.save(makeSaveSurveyResultModel());
      expect(saveResult).toEqual(makeSurveyResultModel());
    });
  });

  describe('LoadSurveyResult Repository', () => {
    test('Should call LoadSurveyResultRepository with correct values', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut();
      const loadBySurveyIdSpy = jest.spyOn(
        loadSurveyResultRepositoryStub,
        'loadBySurveyId'
      );
      const surveyResultData = makeSaveSurveyResultModel();
      await sut.save(surveyResultData);
      expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId);
    });

    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut();
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockRejectedValueOnce(() => {
          throw new Error();
        });
      const promise = sut.save(makeSaveSurveyResultModel());
      await expect(promise).rejects.toThrow();
    });
  });
});
