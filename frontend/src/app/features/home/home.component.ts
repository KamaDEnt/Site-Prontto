import { Component, signal, computed, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

interface Categoria {
  titulo: string;
  icone: string;
  descricao: string;
}

interface Passo {
  label: string;
  titulo: string;
  descricao: string;
  icone: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoFundo') videoFundo!: ElementRef<HTMLVideoElement>;

  private readonly seoService = inject(SeoService);

  readonly passoAtivo = signal(0);
  private intervalo: ReturnType<typeof setInterval> | null = null;

  readonly passos: Passo[] = [
    {
      label: 'O PROBLEMA',
      titulo: 'Algo quebrou em casa?',
      descricao:
        'Vazamentos, elétrica, limpeza ou montagem — imprevistos acontecem. A pergunta é: quem você vai chamar?',
      icone: '🏠',
    },
    {
      label: 'A SOLUÇÃO',
      titulo: 'Encontre o profissional certo',
      descricao:
        'No Prontto, você acessa centenas de profissionais verificados prontos para te atender.',
      icone: '🔍',
    },
    {
      label: 'A CHEGADA',
      titulo: 'Agendado em minutos',
      descricao:
        'Compare perfis, leia avaliações reais e agende com quem você confia.',
      icone: '📅',
    },
    {
      label: 'O RESULTADO',
      titulo: 'Problema resolvido',
      descricao:
        'Serviço feito, avaliação enviada. Tudo simples, tudo no Prontto.',
      icone: '✅',
    },
  ];

  readonly categorias: Categoria[] = [
    { titulo: 'Limpeza', icone: '🧹', descricao: 'Limpeza residencial e comercial' },
    { titulo: 'Encanamento', icone: '🔧', descricao: 'Reparos e instalações hidráulicas' },
    { titulo: 'Elétrica', icone: '⚡', descricao: 'Instalações e reparos elétricos' },
    { titulo: 'Pintura', icone: '🎨', descricao: 'Pintura interna e externa' },
    { titulo: 'Jardinagem', icone: '🌱', descricao: 'Cuidados com jardim e áreas externas' },
    { titulo: 'Mudança', icone: '📦', descricao: 'Transporte e mudanças residenciais' },
  ];

  readonly passoAtualDados = computed(() => this.passos[this.passoAtivo()]);

  ngOnInit(): void {
    this.seoService.atualizarSeo({
      titulo: 'Encontre Prestadores de Serviços',
      descricao: 'Prontto conecta você com prestadores de serviços domésticos de confiança. Limpeza, encanamento, elétrica e muito mais.',
      url: 'https://prontto.org/',
    });
    this.iniciarAvanco();
  }

  ngAfterViewInit(): void {
    const video = this.videoFundo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  ngOnDestroy(): void {
    this.pararAvanco();
  }

  selecionarPasso(index: number): void {
    this.passoAtivo.set(index);
    this.reiniciarAvanco();
  }

  private iniciarAvanco(): void {
    this.intervalo = setInterval(() => {
      this.passoAtivo.update(atual => (atual + 1) % this.passos.length);
    }, 10000);
  }

  private pararAvanco(): void {
    if (this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private reiniciarAvanco(): void {
    this.pararAvanco();
    this.iniciarAvanco();
  }
}
