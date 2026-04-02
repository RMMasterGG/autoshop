import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import {UserRole} from '../auth/auth.model';

export const AdminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated() && authStore.user()?.role === 'ADMIN' as UserRole) {
    return true;
  }

  if (authStore.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};
