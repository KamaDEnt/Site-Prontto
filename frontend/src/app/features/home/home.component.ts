import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SeoService } from '../../core/seo/seo.service';
import { HomeService } from '../../core/api/home.service';
import { Categoria, PrestadorBusca, AvaliacaoHome } from '../../core/models/usuario.model';

const ICONES_CATEGORIA: Record<string, string> = {
  'assistencia-tecnica': '🔧',
  'reformas-reparos': '🧱',
  'servicos-domesticos': '🏠',
  'eletrica': '⚡',
  'pintura': '🎨',
  'limpeza': '🧹',
  'mudancas': '📦',
  'jardinagem': '🌱',
  'aulas': '📚',
  'eventos': '🎉',
  'informatica': '💻',
  'saude-bem-estar': '❤️',
  'autos': '🚗',
  'consultoria': '💼',
  'design-tecnologia': '🖥️',
  'moda-beleza': '💅',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly homeService = inject(HomeService);

  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  readonly categorias = signal<Categoria[]>([]);
  readonly prestadoresDestaque = signal<PrestadorBusca[]>([]);
  readonly avaliacoes = signal<AvaliacaoHome[]>([]);

  readonly prestadorHero = computed(() => this.prestadoresDestaque()[0] ?? null);

  readonly estrelas = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.seoService.atualizarSeo({
      titulo: 'Encontre Prestadores de Serviços — Prontto',
      descricao: 'Mais de 500 tipos de serviços em um só lugar. Encontre profissionais verificados e contrate com segurança.',
      url: 'https://prontto.org/',
    });

    this.homeService.obterDadosHome().subscribe({
      next: dados => {
        this.categorias.set(dados.categorias);
        this.prestadoresDestaque.set(dados.prestadoresDestaque);
        this.avaliacoes.set(dados.avaliacoesRecentes);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os dados.');
        this.carregando.set(false);
      },
    });
  }

  iconeCategoria(slug?: string): string {
    if (!slug) return '🔨';
    return ICONES_CATEGORIA[slug] ?? '🔨';
  }

  cidadePrestador(prestador: PrestadorBusca): string {
    const cidade = prestador.cidades[0];
    return cidade ? `${cidade.nome}, ${cidade.estado}` : 'Brasil';
  }

  especialidadePrestador(prestador: PrestadorBusca): string {
    return prestador.categorias[0]?.nome ?? 'Prestador de Serviços';
  }

  rotaPerfil(prestador: PrestadorBusca): string[] {
    const cidadeSlug = prestador.cidades[0]?.slug ?? 'br';
    const catSlug = prestador.categorias[0]?.slug ?? 'servicos';
    return [cidadeSlug, catSlug, prestador.slug];
  }
}
