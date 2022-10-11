import { AccountModel } from '../../models/account';

// esse protocolo é específico somente dessa rota
// nem precisa de outro arquivo
// é só para amarrar o parâmetro

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}
// a camada de domínio não faz implementações
// somente contém assinatura das regras de negócio do sistema
