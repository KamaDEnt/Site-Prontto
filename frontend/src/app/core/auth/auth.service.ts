import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

interface RespostaAuth {
  token: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _usuario = signal<Usuario | null>(this.carregarUsuarioLocal());
  private readonly _token = signal<string | null>(localStorage.getItem('prontto_token'));

  readonly usuario = this._usuario.asReadonly();
  readonly estaAutenticado = computed(() => this._usuario() !== null);
  readonly ehAdmin = computed(() => this._usuario()?.papel === 'admin');

  entrar(email: string, senha: string) {
    return this.http
      .post<RespostaAuth>(`${environment.apiUrl}/api/auth/login`, { email, senha })
      .pipe(tap(resposta => this.salvarSessao(resposta)));
  }

  cadastrar(dados: {
    nome: string; email: string; senha: string;
    tipoConta: string; telefone?: string; especialidade?: string; cidadeId?: string;
  }) {
    return this.http
      .post<RespostaAuth>(`${environment.apiUrl}/api/auth/register`, {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        tipoConta: dados.tipoConta,
        telefone: dados.telefone,
        especialidade: dados.especialidade,
        cidadeId: dados.cidadeId,
      })
      .pipe(tap(resposta => this.salvarSessao(resposta)));
  }

  sair(): void {
    localStorage.removeItem('prontto_token');
    localStorage.removeItem('prontto_usuario');
    this._token.set(null);
    this._usuario.set(null);
  }

  obterToken(): string | null {
    return this._token();
  }

  private salvarSessao(resposta: RespostaAuth): void {
    const usuario = this.mapearUsuario(resposta.user);
    localStorage.setItem('prontto_token', resposta.token);
    localStorage.setItem('prontto_usuario', JSON.stringify(usuario));
    this._token.set(resposta.token);
    this._usuario.set(usuario);
  }

  private carregarUsuarioLocal(): Usuario | null {
    const dados = localStorage.getItem('prontto_usuario');
    return dados ? JSON.parse(dados) : null;
  }

  private mapearUsuario(dados: any): Usuario {
    return {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      tipoConta: dados.tipoConta,
      papel: dados.papel,
      especialidade: dados.especialidade,
      cidadeId: dados.cidadeId,
      fotoPerfilUrl: dados.fotoPerfilUrl,
      slug: dados.slug,
      mediaAvaliacoes: dados.mediaAvaliacoes ?? 0,
      totalAvaliacoes: dados.totalAvaliacoes ?? 0,
      criadoEm: dados.criadoEm,
    };
  }
}
