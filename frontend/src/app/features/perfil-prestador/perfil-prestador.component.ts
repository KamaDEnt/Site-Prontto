import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { AuthService } from '../../core/auth/auth.service';
import { PerfilPublico } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-prestador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-prestador.component.html',
  styleUrl: './perfil-prestador.component.scss',
})
export class PerfilPrestadorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly perfilService = inject(PerfilPrestadorService);
  readonly auth = inject(AuthService);

  readonly perfil = signal<PerfilPublico | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.perfilService.obterPerfilPublico(slug).subscribe({
      next: (dados) => {
        this.perfil.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);
        if (err.status === 404) {
          this.erro.set('Prestador não encontrado.');
        } else {
          this.erro.set('Ocorreu um erro ao carregar o perfil. Tente novamente.');
        }
      },
    });
  }

  contratar(): void {
    const usuario = this.auth.usuario();
    if (!usuario) {
      const returnUrl = this.router.url;
      this.router.navigate(['/entrar'], { queryParams: { returnUrl } });
      return;
    }
    // Placeholder para RF-04 — criação de solicitação de serviço
    // TODO: navegar para a tela de criação de serviço com o prestadorId pré-selecionado
    alert('Funcionalidade disponível em breve (RF-04).');
  }

  get estrelas(): number[] {
    const media = Math.round(this.perfil()?.mediaAvaliacoes ?? 0);
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  estralaAtiva(index: number): boolean {
    return index <= Math.round(this.perfil()?.mediaAvaliacoes ?? 0);
  }
}
