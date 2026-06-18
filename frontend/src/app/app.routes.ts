import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'servicos/novo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/servicos/criar-servico/criar-servico.component').then(
        m => m.CriarServicoComponent,
      ),
  },
  {
    path: 'servicos',
    loadComponent: () =>
      import('./features/servicos/servicos.component').then(m => m.ServicosComponent),
  },
  {
    path: 'como-funciona',
    loadComponent: () =>
      import('./features/como-funciona/como-funciona.component').then(m => m.ComoFuncionaComponent),
  },
  {
    path: 'para-prestadores',
    loadComponent: () =>
      import('./features/para-prestadores/para-prestadores.component').then(m => m.ParaPrestadoresComponent),
  },
  {
    path: 'entrar',
    loadComponent: () =>
      import('./features/auth/entrar/entrar.component').then(m => m.EntrarComponent),
  },
  {
    path: 'cadastrar',
    loadComponent: () =>
      import('./features/auth/cadastrar/cadastrar.component').then(m => m.CadastrarComponent),
  },
  {
    path: 'minha-area',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/minha-area/minha-area.component').then(m => m.MinhaAreaComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'servicos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/servico-detalhe/servico-detalhe.component').then(
        m => m.ServicoDetalheComponent,
      ),
  },
  // Rota canônica SEO: /:cidadeSlug/:categoriaSlug/:slug
  {
    path: ':cidadeSlug/:categoriaSlug/:slug',
    loadComponent: () =>
      import('./features/perfil-prestador/perfil-prestador.component').then(
        m => m.PerfilPrestadorComponent,
      ),
  },
  // Alias mantido para compatibilidade
  {
    path: 'prestador/:slug',
    loadComponent: () =>
      import('./features/perfil-prestador/perfil-prestador.component').then(
        m => m.PerfilPrestadorComponent,
      ),
  },
  {
    path: 'seguranca',
    loadComponent: () =>
      import('./features/seguranca/seguranca.component').then(m => m.SegurancaComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
