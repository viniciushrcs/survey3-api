export interface CheckSurveyByIdRepository {
  checkById(id: string): Promise<boolean>;
}
