import { Injectable } from '@angular/core';
import {
  CredentialDerivationPort,
  DerivationOptions
} from '../../core/ports/security/credential-derivation.port';

@Injectable()
export class WebCryptoCredentialDerivationAdapter implements CredentialDerivationPort {
  async derive(input: string, options: DerivationOptions): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(input),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: new TextEncoder().encode(options.salt),
        iterations: options.iterations
      },
      key,
      256
    );

    return Array.from(new Uint8Array(bits), (part) => part.toString(16).padStart(2, '0')).join('');
  }
}
