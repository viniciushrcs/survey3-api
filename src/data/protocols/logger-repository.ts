export interface LoggerRepository {
  log(stack: string): Promise<void>;
}
