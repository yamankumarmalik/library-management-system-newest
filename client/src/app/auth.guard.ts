import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = (route, state) => {
  const toast = inject(NgToastService);
  const router = inject(Router);
  if (localStorage.getItem('token')) {
    return true;
  } else {
    toast.error({
      detail: 'Unauthorized Access',
      summary: 'Login to gain Access',
      sticky: true,
      position: 'topCenter',
    });
    router.navigate(['/login']);
  }
};
