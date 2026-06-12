import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { BankingService } from '../../core/api/banking.service';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { DadosBancarios, Categoria, Cidade } from '../../core/models/usuario.model';

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
  readonly abaAtiva = signal<'perfil' | 'banking' | 'servicos'>('perfil');

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
    }
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

  sair(): void {
    this.auth.sair();
  }
}
