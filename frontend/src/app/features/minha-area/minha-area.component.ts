import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { BankingService } from '../../core/api/banking.service';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { ServicosService } from '../../core/api/servicos.service';
import { AvaliacoesService } from '../../core/api/avaliacoes.service';
import { DadosBancarios, Categoria, Cidade, Servico, StatusServico, ImagemPortfolio } from '../../core/models/usuario.model';

interface TipoPix {
  valor: string;
  label: string;
  icone: string;
}

@Component({
  selector: 'app-minha-area',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './minha-area.component.html',
  styleUrl: './minha-area.component.scss',
})
export class MinhaAreaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly bankingService = inject(BankingService);
  private readonly perfilService = inject(PerfilPrestadorService);
  private readonly servicosService = inject(ServicosService);
  private readonly avaliacoesService = inject(AvaliacoesService);

  readonly usuario = this.auth.usuario;
  readonly dadosBancarios = signal<DadosBancarios | null>(null);
  readonly salvando = signal(false);
  readonly mensagem = signal<string | null>(null);

  // Perfil do prestador
  readonly salvandoPerfil = signal(false);
  readonly mensagemPerfil = signal<string | null>(null);
  readonly categorias = signal<Categoria[]>([]);
  readonly cidades = signal<Cidade[]>([]);

  // Aba ativa
  readonly abaAtiva = signal<'perfil' | 'banking' | 'servicos' | 'portfolio'>('perfil');

  // ── Portfólio (upload local) ─────────────────────────────────────────────────
  readonly imagens = signal<ImagemPortfolio[]>([]);
  readonly carregandoImagens = signal(false);
  readonly uploadEmAndamento = signal(false);
  readonly erroUpload = signal<string | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly arquivoSelecionado = signal<File | null>(null);

  // Serviços do usuário
  readonly servicos = signal<Servico[]>([]);
  readonly carregandoServicos = signal(false);
  readonly erroServicos = signal<string | null>(null);

  // ── Avaliações (RF-08) ───────────────────────────────────────────────────────
  /** servicoId que está com o formulário de avaliação aberto (null = nenhum) */
  readonly avaliacaoAberta = signal<string | null>(null);
  /** nota selecionada no seletor de estrelas (0 = nenhuma) */
  readonly notaSelecionada = signal(0);
  /** nota em hover para preview visual */
  readonly notaHover = signal(0);
  /** texto do comentário em edição */
  readonly comentarioTexto = signal('');
  /** set de servicoIds já avaliados com sucesso nesta sessão */
  readonly avaliacoesEnviadas = signal<Set<string>>(new Set());
  /** flag de envio em progresso */
  readonly enviandoAvaliacao = signal(false);
  /** mensagem de erro por serviço */
  readonly erroAvaliacao = signal<string | null>(null);

  readonly tiposPix: TipoPix[] = [
    { valor: 'cpf', label: 'CPF', icone: '🪪' },
    { valor: 'cnpj', label: 'CNPJ', icone: '🏢' },
    { valor: 'email', label: 'E-mail', icone: '✉️' },
    { valor: 'telefone', label: 'Telefone', icone: '📱' },
    { valor: 'aleatoria', label: 'Aleatória', icone: '🔑' },
  ];

  readonly formularioBanking = this.fb.group({
    tipoChavePix: ['cpf'],
    chavePix: [''],
    nomeCompleto: [''],
    cpfCnpj: [''],
    nomeBanco: [''],
    agencia: [''],
    numeroConta: [''],
    tipoConta: [''],
  });

  readonly formularioPerfil = this.fb.group({
    descricao: [''],
    especialidade: [''],
    fotoPerfilUrl: [''],
  });

  // IDs selecionados (multiselect via checkboxes)
  readonly categoriasSelecionadas = signal<Set<string>>(new Set());
  readonly cidadesSelecionadas = signal<Set<string>>(new Set());

  ngOnInit(): void {
    const u = this.usuario();

    if (u?.tipoConta === 'prestador') {
      this.abaAtiva.set('perfil');

      this.bankingService.obterDadosBancarios().subscribe({
        next: (res) => {
          this.dadosBancarios.set(res.banking);
          if (res.banking) {
            this.formularioBanking.patchValue({
              tipoChavePix: res.banking.tipoChavePix,
              chavePix: res.banking.chavePix,
              nomeCompleto: res.banking.nomeCompleto,
              cpfCnpj: res.banking.cpfCnpj,
              nomeBanco: res.banking.nomeBanco ?? '',
              agencia: res.banking.agencia ?? '',
              numeroConta: res.banking.numeroConta ?? '',
              tipoConta: res.banking.tipoConta ?? '',
            });
          }
        },
      });

      this.perfilService.listarCategorias().subscribe({
        next: (cats) => this.categorias.set(cats),
      });
      this.perfilService.listarCidades().subscribe({
        next: (cids) => this.cidades.set(cids),
      });

      this.formularioPerfil.patchValue({
        descricao: u.descricao ?? '',
        especialidade: u.especialidade ?? '',
        fotoPerfilUrl: u.fotoPerfilUrl ?? '',
      });
    } else {
      this.abaAtiva.set('servicos');
      this.carregarServicos();
    }
  }

  carregarServicos(): void {
    this.carregandoServicos.set(true);
    this.erroServicos.set(null);
    this.servicosService.listarMeusServicos().subscribe({
      next: (res) => {
        this.servicos.set(res.servicos);
        this.carregandoServicos.set(false);
      },
      error: () => {
        this.erroServicos.set('Não foi possível carregar seus serviços. Tente novamente.');
        this.carregandoServicos.set(false);
      },
    });
  }

  mudarAba(aba: 'perfil' | 'banking' | 'servicos' | 'portfolio'): void {
    this.abaAtiva.set(aba);
    if (aba === 'servicos' && this.servicos().length === 0 && !this.carregandoServicos()) {
      this.carregarServicos();
    }
    if (aba === 'portfolio' && this.imagens().length === 0 && !this.carregandoImagens()) {
      this.carregarImagens();
    }
  }

  badgeStatus(status: StatusServico): { texto: string; cor: string } {
    const mapa: Record<StatusServico, { texto: string; cor: string }> = {
      em_negociacao: { texto: 'Em negociação', cor: 'amarelo' },
      aguardando_pagamento: { texto: 'Aguard. pagamento', cor: 'amarelo' },
      pago: { texto: 'Pago', cor: 'azul' },
      em_andamento: { texto: 'Em andamento', cor: 'roxo' },
      aguardando_confirmacao_cliente: { texto: 'Aguard. confirmação', cor: 'laranja' },
      em_disputa: { texto: 'Em disputa', cor: 'vermelho' },
      concluido: { texto: 'Concluído', cor: 'verde' },
      cancelado: { texto: 'Cancelado', cor: 'cinza' },
    };
    return mapa[status] ?? { texto: status, cor: 'cinza' };
  }

  salvarBanking(): void {
    this.salvando.set(true);
    this.bankingService.salvarDadosBancarios(this.formularioBanking.value as any).subscribe({
      next: (res) => {
        this.dadosBancarios.set(res.banking);
        this.mensagem.set('Dados bancários salvos com sucesso!');
        this.salvando.set(false);
      },
      error: () => {
        this.mensagem.set('Erro ao salvar dados bancários.');
        this.salvando.set(false);
      },
    });
  }

  salvarPerfil(): void {
    this.salvandoPerfil.set(true);
    const v = this.formularioPerfil.value;

    this.perfilService
      .atualizarPerfil({
        descricao: v.descricao ?? undefined,
        especialidade: v.especialidade ?? undefined,
        fotoPerfilUrl: v.fotoPerfilUrl ?? undefined,
        categoriaIds: Array.from(this.categoriasSelecionadas()),
        cidadeIds: Array.from(this.cidadesSelecionadas()),
      })
      .subscribe({
        next: () => {
          this.mensagemPerfil.set('Perfil atualizado com sucesso!');
          this.salvandoPerfil.set(false);
        },
        error: () => {
          this.mensagemPerfil.set('Erro ao salvar perfil. Tente novamente.');
          this.salvandoPerfil.set(false);
        },
      });
  }

  toggleCategoria(id: string): void {
    const set = new Set(this.categoriasSelecionadas());
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.categoriasSelecionadas.set(set);
  }

  toggleCidade(id: string): void {
    const set = new Set(this.cidadesSelecionadas());
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.cidadesSelecionadas.set(set);
  }

  categoriaEscolhida(id: string): boolean {
    return this.categoriasSelecionadas().has(id);
  }

  cidadeEscolhida(id: string): boolean {
    return this.cidadesSelecionadas().has(id);
  }

  get precisaCompletarPerfil(): boolean {
    return this.usuario()?.tipoConta === 'prestador' && !this.usuario()?.slug;
  }

  // ── Métodos de portfólio ─────────────────────────────────────────────────────

  carregarImagens(): void {
    this.carregandoImagens.set(true);
    this.perfilService.obterPerfilPublico(this.usuario()?.slug ?? '').subscribe({
      next: (perfil) => {
        this.imagens.set(perfil.imagensPortfolio ?? []);
        this.carregandoImagens.set(false);
      },
      error: () => {
        this.carregandoImagens.set(false);
      },
    });
  }

  onArquivoSelecionado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      this.erroUpload.set('Tipo de arquivo não permitido. Use JPG, PNG ou WebP.');
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      this.erroUpload.set('Arquivo muito grande. O limite é 5 MB.');
      return;
    }

    this.erroUpload.set(null);
    this.arquivoSelecionado.set(arquivo);

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(arquivo);

    // Limpa o valor do input para permitir reselecionar o mesmo arquivo
    input.value = '';
  }

  uploadImagem(): void {
    const arquivo = this.arquivoSelecionado();
    if (!arquivo) return;

    this.uploadEmAndamento.set(true);
    this.erroUpload.set(null);

    const ordemAtual = this.imagens().length;
    this.perfilService.uploadImagem(arquivo, ordemAtual).subscribe({
      next: (res) => {
        const novaImagem: ImagemPortfolio = {
          id: res.id,
          url: res.url,
          ordem: ordemAtual,
        };
        this.imagens.update((lista) => [...lista, novaImagem]);
        this.previewUrl.set(null);
        this.arquivoSelecionado.set(null);
        this.uploadEmAndamento.set(false);
      },
      error: (err) => {
        const status = err?.status;
        if (status === 400) {
          this.erroUpload.set('Arquivo inválido. Verifique o tipo e o tamanho (máx 5 MB).');
        } else if (status === 413) {
          this.erroUpload.set('Arquivo muito grande. O limite é 5 MB.');
        } else {
          this.erroUpload.set('Erro ao enviar imagem. Tente novamente.');
        }
        this.uploadEmAndamento.set(false);
      },
    });
  }

  removerImagem(id: string): void {
    this.perfilService.removerImagem(id).subscribe({
      next: () => {
        this.imagens.update((lista) => lista.filter((img) => img.id !== id));
      },
      error: () => {
        // Falha silenciosa — imagem permanece na lista
      },
    });
  }

  sair(): void {
    this.auth.sair();
  }

  // ── Métodos de avaliação (RF-08) ─────────────────────────────────────────────

  jaAvaliou(servicoId: string): boolean {
    return this.avaliacoesEnviadas().has(servicoId);
  }

  abrirFormularioAvaliacao(servicoId: string): void {
    this.avaliacaoAberta.set(servicoId);
    this.notaSelecionada.set(0);
    this.notaHover.set(0);
    this.comentarioTexto.set('');
    this.erroAvaliacao.set(null);
  }

  fecharFormularioAvaliacao(): void {
    this.avaliacaoAberta.set(null);
    this.notaSelecionada.set(0);
    this.notaHover.set(0);
    this.comentarioTexto.set('');
    this.erroAvaliacao.set(null);
  }

  selecionarNota(nota: number): void {
    this.notaSelecionada.set(nota);
  }

  definirHoverNota(nota: number): void {
    this.notaHover.set(nota);
  }

  limparHoverNota(): void {
    this.notaHover.set(0);
  }

  notaEfetiva(): number {
    return this.notaHover() || this.notaSelecionada();
  }

  enviarAvaliacao(servicoId: string): void {
    const nota = this.notaSelecionada();
    if (nota < 1 || nota > 5) {
      this.erroAvaliacao.set('Selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    this.enviandoAvaliacao.set(true);
    this.erroAvaliacao.set(null);

    const comentario = this.comentarioTexto().trim() || undefined;

    this.avaliacoesService.registrar(servicoId, nota, comentario).subscribe({
      next: () => {
        const enviadas = new Set(this.avaliacoesEnviadas());
        enviadas.add(servicoId);
        this.avaliacoesEnviadas.set(enviadas);
        this.enviandoAvaliacao.set(false);
        this.avaliacaoAberta.set(null);
        this.notaSelecionada.set(0);
        this.comentarioTexto.set('');
      },
      error: (err) => {
        this.enviandoAvaliacao.set(false);
        if (err.status === 409) {
          // Já avaliado — marcar como avaliado e fechar
          const enviadas = new Set(this.avaliacoesEnviadas());
          enviadas.add(servicoId);
          this.avaliacoesEnviadas.set(enviadas);
          this.avaliacaoAberta.set(null);
        } else if (err.status === 403) {
          this.erroAvaliacao.set('Você não tem permissão para avaliar este serviço.');
        } else {
          this.erroAvaliacao.set('Erro ao enviar avaliação. Tente novamente.');
        }
      },
    });
  }

  readonly indicesEstrelas = [1, 2, 3, 4, 5] as const;
}
