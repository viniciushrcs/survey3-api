// Única classe que se suja com o bcrypt
// O padrão adapter faz com que apenas uma classe se suje com uma dependência externa
// e ela tem que se adaptar para se plugar ao seu sistema
// o adapter faz a adaptação mundo externo -> interface -> mundo interno
import { Encrypter } from '../../data/protocols/encrypter';
import { hash } from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
    // já que o salt é específico dessa implementação, a gente não suja
    // o método encrypt mexendo na interface
    // mantemos o protocolo como está e as dependências dessa implementação
    // vêm no constructor
  }
  async encrypt(value: string): Promise<string> {
    return await hash(value, this.salt);
  }
}
