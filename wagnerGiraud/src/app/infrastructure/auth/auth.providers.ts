import { Provider } from '@angular/core';
import { CREDENTIAL_POLICY_REPOSITORY_PORT } from '../../core/ports/auth/credential-policy-repository.port';
import { CREDENTIAL_DERIVATION_PORT } from '../../core/ports/security/credential-derivation.port';
import { StaticCredentialPolicyRepository } from './static-credential-policy.repository';
import { WebCryptoCredentialDerivationAdapter } from '../security/web-crypto-credential-derivation.adapter';

export function provideAuthHexagon(): Provider[] {
  return [
    {
      provide: CREDENTIAL_POLICY_REPOSITORY_PORT,
      useClass: StaticCredentialPolicyRepository
    },
    {
      provide: CREDENTIAL_DERIVATION_PORT,
      useClass: WebCryptoCredentialDerivationAdapter
    }
  ];
}
