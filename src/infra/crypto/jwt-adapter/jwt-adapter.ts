import { TokenGenerator } from '../../../data/protocols/crypto/token-generator';
import jwt from 'jsonwebtoken';
import { TokenVerifier } from '../../../data/protocols/crypto/tokenVerifier';

export class JwtAdapter implements TokenGenerator, TokenVerifier {
  constructor(private readonly secret: string) {}
  async generate(id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret);
    return new Promise((resolve) => resolve(accessToken));
  }

  async verify(token: string): Promise<string> {
    const value = (await jwt.verify(token, this.secret)) as string;
    return new Promise((resolve) => resolve(value));
  }
}
