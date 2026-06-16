import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { Categoria, Cidade, PrestadorBusca, ResultadoPaginado } from '../../core/models/usuario.model';
import { SeoService } from '../../core/seo/seo.service';

// Mapeamento de slug → emoji (ícones temporários para as categorias)
const ICONES: Record<string, string> = {
  'encanador': '🔧',
  'eletricista': '⚡',
  'pintor': '🎨',
  'pedreiro': '🏗️',
  'marceneiro': '🪵',
  'diarista': '🧹',
  'jardineiro': '🌱',
  'ar-condicionado': '❄️',
  'serralheiro': '🔩',
  'dedetizador': '🐛',
  'mudanca': '📦',
  'limpeza': '🧺',
};

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss',
})
export class ServicosComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly perfilService = inject(PerfilPrestadorService);
  private readonly seoService = inject(SeoService);
  private readonly destroy$ = new Subject<void>();

  // Estado do catálogo
  readonly categorias = signal<Categoria[]>([]);
  readonly cidades = signal<Cidade[]>([]);

  // Estado de busca
  readonly categoriaSelecionada = signal<string | null>(null);
  readonly cidadeSelecionada = signal<string>('');

  // Estado de resultados
  readonly prestadores = signal<PrestadorBusca[]>([]);
  readonly totalCount = signal<number>(0);
  readonly paginaAtual = signal<number>(1);
  readonly pageSize = 20;

  // Estado de carregamento
  readonly carregandoCategorias = signal<boolean>(false);
  readonly carregandoResultados = signal<boolean>(false);
  readonly erroCategoria = signal<boolean>(false);

  // Computed: nome da categoria selecionada para exibição no header
  readonly nomeCategoriaAtual = computed(() => {
    const slug = this.categoriaSelecionada();
    if (!slug) return null;
    return this.categorias().find(c => c.slug === slug)?.nome ?? null;
  });

  readonly totalPaginas = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize)
  );

  readonly temPaginaAnterior = computed(() => this.paginaAtual() > 1);
  readonly temProximaPagina = computed(() => this.paginaAtual() < this.totalPaginas());

  ngOnInit(): void {
    this.seoService.atualizarSeo({
      titulo: 'Serviços Disponíveis',
      descricao: 'Explore prestadores de serviços domésticos na sua cidade. Filtre por categoria, avaliação e localização.',
      url: 'https://prontto.org/servicos',
    });
    this.carregarCatalogo();

    // Reage a mudanças de query params sem recarregar o componente
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const categoriaSlug = params['categoria'] ?? null;
        const cidadeSlug = params['cidade'] ?? '';
        const page = parseInt(params['page'] ?? '1', 10);

        this.categoriaSelecionada.set(categoriaSlug);
        this.cidadeSelecionada.set(cidadeSlug);
        this.paginaAtual.set(isNaN(page) || page < 1 ? 1 : page);

        if (categoriaSlug) {
          this.executarBusca(categoriaSlug, cidadeSlug || undefined, this.paginaAtual());
        } else {
          // Sem categoria selecionada — exibe grade de categorias
          this.prestadores.set([]);
          this.totalCount.set(0);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Catálogo ────────────────────────────────────────────────────────────────

  private carregarCatalogo(): void {
    this.carregandoCategorias.set(true);

    this.perfilService.listarCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: cats => {
          this.categorias.set(cats);
          this.carregandoCategorias.set(false);
        },
        error: () => {
          this.carregandoCategorias.set(false);
        },
      });

    this.perfilService.listarCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: cids => this.cidades.set(cids),
      });
  }

  // ── Busca ────────────────────────────────────────────────────────────────────

  private executarBusca(categoriaSlug: string, cidadeSlug?: string, page = 1): void {
    this.carregandoResultados.set(true);
    this.erroCategoria.set(false);

    this.perfilService.buscarPrestadores(categoriaSlug, cidadeSlug, page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resultado: ResultadoPaginado<PrestadorBusca>) => {
          this.prestadores.set(resultado.items);
          this.totalCount.set(resultado.totalCount);
          this.carregandoResultados.set(false);
        },
        error: (err) => {
          if (err.status === 404) {
            this.erroCategoria.set(true);
          }
          this.prestadores.set([]);
          this.totalCount.set(0);
          this.carregandoResultados.set(false);
        },
      });
  }

  // ── Interações do usuário ────────────────────────────────────────────────────

  selecionarCategoria(slug: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: slug, cidade: this.cidadeSelecionada() || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  filtrarPorCidade(cidadeSlug: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cidade: cidadeSlug || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  limparFiltros(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: null, cidade: null, page: null },
    });
  }

  verPerfil(slug: string): void {
    this.router.navigate(['/prestador', slug]);
  }

  paginaAnterior(): void {
    if (!this.temPaginaAnterior()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.paginaAtual() - 1 },
      queryParamsHandling: 'merge',
    });
  }

  proximaPagina(): void {
    if (!this.temProximaPagina()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.paginaAtual() + 1 },
      queryParamsHandling: 'merge',
    });
  }

  // ── Utilitários ─────────────────────────────────────────────────────────────

  iconeCategoria(slug: string): string {
    return ICONES[slug] ?? '🔨';
  }

  formatarEstrelas(media: number): string {
    const cheias = Math.floor(media);
    return '★'.repeat(cheias) + '☆'.repeat(5 - cheias);
  }

  nomeCidades(prestador: PrestadorBusca): string {
    return prestador.cidades.map(c => c.nome).join(', ') || '—';
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
