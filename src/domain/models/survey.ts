export interface SurveyModel {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
  didAnswer?: boolean;
}

export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}
