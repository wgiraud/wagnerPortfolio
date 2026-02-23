import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly storageKey = 'wg-auth-session-v1';
  private readonly authenticatedState = signal<boolean>(this.loadSession());

  readonly isAuthenticated = this.authenticatedState.asReadonly();

  startSession(): void {
    this.authenticatedState.set(true);
    this.persistSession(true);
  }

  endSession(): void {
    this.authenticatedState.set(false);
    this.persistSession(false);
  }

  private loadSession(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(this.storageKey) === 'true';
  }

  private persistSession(value: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, String(value));
  }
}
