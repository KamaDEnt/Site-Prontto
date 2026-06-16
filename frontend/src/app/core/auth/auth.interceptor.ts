import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);
  const token = auth.obterToken();

  if (token) {
    const requisicaoComToken = requisicao.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return proximo(requisicaoComToken);
  }

  return proximo(requisicao);
};
