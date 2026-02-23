import { InjectionToken } from '@angular/core';

export interface DerivationOptions {
  salt: string;
  iterations: number;
}

export interface CredentialDerivationPort {
  derive(input: string, options: DerivationOptions): Promise<string>;
}

export const CREDENTIAL_DERIVATION_PORT = new InjectionToken<CredentialDerivationPort>(
  'CREDENTIAL_DERIVATION_PORT'
);
