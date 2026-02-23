import { Injectable } from '@angular/core';
import { CredentialPolicy } from '../../core/domain/auth/credential-policy.model';
import { CredentialPolicyRepositoryPort } from '../../core/ports/auth/credential-policy-repository.port';

@Injectable()
export class StaticCredentialPolicyRepository implements CredentialPolicyRepositoryPort {
  private readonly credentialPolicy: CredentialPolicy = {
    username: {
      salt: this.decodeAscii([119, 103, 45, 117, 115, 101, 114, 45, 110, 101, 111, 110, 45, 50, 48, 50, 54]),
      iterations: 120000,
      expectedHash: ['dc3c8c4f07cb743e', '63b8c7d0d9377052', '487fc404e428cc3d', '76de4b80c2513c1a'].join('')
    },
    password: {
      salt: this.decodeAscii([119, 103, 45, 112, 97, 115, 115, 45, 110, 101, 111, 110, 45, 50, 48, 50, 54]),
      iterations: 180000,
      expectedHash: ['0325d1572f962ed7', '1b109d997a86aa11', 'e2a074793b37b262', '669c33316f5b78ec'].join('')
    }
  };

  async getCredentialPolicy(): Promise<CredentialPolicy> {
    return this.credentialPolicy;
  }

  private decodeAscii(buffer: number[]): string {
    return String.fromCharCode(...buffer);
  }
}
