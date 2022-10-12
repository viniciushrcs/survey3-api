import MockDate from 'mockdate';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols';

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSurveyResultModel = (): SurveyResultModel => ({
  ...makeSaveSurveyResultModel(),
  id: 'any_id'
});

const makeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  surveyId: 'survey_id',
  userId: 'user_id',
  answer: 'any_answer',
  date: new Date()
});

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResultModel());
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub
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
});
