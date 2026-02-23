import { InjectionToken } from '@angular/core';
import { CredentialPolicy } from '../../domain/auth/credential-policy.model';

export interface CredentialPolicyRepositoryPort {
  getCredentialPolicy(): Promise<CredentialPolicy>;
}

export const CREDENTIAL_POLICY_REPOSITORY_PORT = new InjectionToken<CredentialPolicyRepositoryPort>(
  'CREDENTIAL_POLICY_REPOSITORY_PORT'
);
