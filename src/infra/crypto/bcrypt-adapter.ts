import { Encrypter } from '../../data/protocols/crypto/encrypter';
import { compare, hash } from 'bcrypt';
import { HashComparer } from '../../data/protocols/crypto/hash-comparer';

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    return await hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash);
  }
}
