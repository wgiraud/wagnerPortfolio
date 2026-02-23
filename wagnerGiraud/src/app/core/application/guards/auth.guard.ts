import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionStore } from '../state/auth-session.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const authSessionStore = inject(AuthSessionStore);
  const router = inject(Router);

  if (authSessionStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
