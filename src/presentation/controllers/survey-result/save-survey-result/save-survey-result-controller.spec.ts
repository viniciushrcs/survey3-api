import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyModel,
  SurveyResultModel
} from './save-survey-result-controller-protocols';
import MockDate from 'mockdate';
import { forbidden } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';

interface SutTypes {
  sut: SaveSurveyResultController;
  saveSurveyResultStub: SaveSurveyResult;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(
      surveyResult: SaveSurveyResultModel
    ): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeSurveyResult()));
    }
  }
  return new SaveSurveyResultStub();
};

const makeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'survey_id',
  userId: 'user_id',
  answer: 'any_answer',
  date: new Date()
});

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

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResultStub();
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    saveSurveyResultStub,
    loadSurveyByIdStub
  };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
});

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset;
  });

  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct values', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
      await sut.handle(makeFakeRequest());
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
    });
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null);

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
});
