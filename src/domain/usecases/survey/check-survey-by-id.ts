export interface CheckSurveyById {
  checkById(id: string): Promise<boolean>;
}
