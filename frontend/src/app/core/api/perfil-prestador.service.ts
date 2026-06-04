import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PerfilPublico,
  Categoria,
  Cidade,
  ImagemPortfolio,
  ComandoAtualizarPerfil,
} from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class PerfilPrestadorService {
  private readonly http = inject(HttpClient);
  private readonly baseAuth = `${environment.apiUrl}/api/auth`;
  private readonly baseApi = environment.apiUrl;

  /**
   * Obtém o perfil público de um prestador pelo slug.
   * Rota: GET /{cidadeSlug}/{categoriaSlug}/{slug}
   * Para V1 simplificada: GET /prestador-publico/{slug} via proxy ou slug direto.
   * O backend usa /{cidadeSlug}/{categoriaSlug}/{slug} mas pode ser chamado com valores dummy.
   */
  obterPerfilPublico(slug: string): Observable<PerfilPublico> {
    // Usa valores canônicos da URL pública. Em V1 o slug é suficiente para localizar o prestador.
    return this.http.get<PerfilPublico>(`${this.baseApi}/v/v/${slug}`);
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseApi}/api/categorias`);
  }

  listarCidades(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.baseApi}/api/cidades`);
  }

  /**
   * Atualiza o perfil público do prestador autenticado.
   * Requer token Bearer (injetado pelo authInterceptor).
   */
  atualizarPerfil(dados: ComandoAtualizarPerfil): Observable<{ perfil: PerfilPublico }> {
    return this.http.put<{ perfil: PerfilPublico }>(`${this.baseAuth}/perfil`, dados);
  }

  /**
   * Registra uma imagem no portfólio após upload direto ao Cloudinary (ADR-03).
   */
  adicionarImagem(
    url: string,
    cloudinaryPublicId: string,
    ordem = 0,
  ): Observable<{ imagem: ImagemPortfolio & { status: string } }> {
    return this.http.post<{ imagem: ImagemPortfolio & { status: string } }>(
      `${this.baseAuth}/portfolio`,
      { url, cloudinaryPublicId, ordem },
    );
  }

  /**
   * Remove uma imagem do portfólio (soft delete).
   */
  removerImagem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseAuth}/portfolio/${id}`);
  }
}
