import { Inject, Injectable } from '@angular/core';
import { LoginCredentials } from '../../domain/auth/login-credentials.model';
import { constantTimeEquals } from '../../domain/security/constant-time-equals';
import {
  CREDENTIAL_POLICY_REPOSITORY_PORT,
  CredentialPolicyRepositoryPort
} from '../../ports/auth/credential-policy-repository.port';
import {
  CREDENTIAL_DERIVATION_PORT,
  CredentialDerivationPort
} from '../../ports/security/credential-derivation.port';

@Injectable({ providedIn: 'root' })
export class AuthenticatePortfolioOwnerUseCase {
  constructor(
    @Inject(CREDENTIAL_POLICY_REPOSITORY_PORT)
    private readonly credentialPolicyRepository: CredentialPolicyRepositoryPort,
    @Inject(CREDENTIAL_DERIVATION_PORT)
    private readonly credentialDerivation: CredentialDerivationPort
  ) {}

  async execute(credentials: LoginCredentials): Promise<boolean> {
    const policy = await this.credentialPolicyRepository.getCredentialPolicy();
    const username = credentials.username.trim().toLowerCase();
    const password = credentials.password.trim();

    const [usernameHash, passwordHash] = await Promise.all([
      this.credentialDerivation.derive(username, {
        salt: policy.username.salt,
        iterations: policy.username.iterations
      }),
      this.credentialDerivation.derive(password, {
        salt: policy.password.salt,
        iterations: policy.password.iterations
      })
    ]);

    return (
      constantTimeEquals(usernameHash, policy.username.expectedHash) &&
      constantTimeEquals(passwordHash, policy.password.expectedHash)
    );
  }
}
