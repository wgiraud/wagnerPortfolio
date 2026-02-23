export interface CredentialRule {
  salt: string;
  iterations: number;
  expectedHash: string;
}

export interface CredentialPolicy {
  username: CredentialRule;
  password: CredentialRule;
}
