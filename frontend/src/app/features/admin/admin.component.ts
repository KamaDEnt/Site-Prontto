import { Component, inject, signal, OnInit } from '@angular/core';
import { AdminService } from '../../core/api/admin.service';
import { EstatisticasAdmin, Servico, StatusServico, Cobranca, Usuario } from '../../core/models/usuario.model';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly estatisticas = signal<EstatisticasAdmin | null>(null);
  readonly servicos = signal<Servico[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly listaCobrancas = signal<Cobranca[]>([]);
  readonly abaSelecionada = signal<'stats' | 'servicos' | 'usuarios' | 'financeiro'>('stats');
  readonly carregando = signal(false);

  ngOnInit(): void {
    this.carregarEstatisticas();
    this.carregarServicos();
    this.carregarUsuarios();
    this.carregarCobrancas();
  }

  carregarEstatisticas(): void {
    this.adminService.obterEstatisticas().subscribe(dados => this.estatisticas.set(dados));
  }

  carregarServicos(): void {
    this.adminService.listarServicos().subscribe(res => this.servicos.set(res.services));
  }

  carregarUsuarios(): void {
    this.adminService.listarUsuarios().subscribe(res => this.usuarios.set(res.users));
  }

  carregarCobrancas(): void {
    this.adminService.listarCobranças().subscribe(res => this.listaCobrancas.set(res.charges));
  }

  atualizarStatus(servicoId: string, status: StatusServico): void {
    this.adminService.atualizarStatusServico(servicoId, status).subscribe({
      next: () => this.carregarServicos(),
    });
  }

  rotularStatus(status: StatusServico): string {
    const rotulos: Record<StatusServico, string> = {
      em_negociacao: 'Em negociação',
      aguardando_pagamento: 'Aguardando pagamento',
      pago: 'Pago',
      em_andamento: 'Em andamento',
      aguardando_confirmacao_cliente: 'Aguardando confirmação',
      em_disputa: 'Em disputa',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    return rotulos[status];
  }
}
