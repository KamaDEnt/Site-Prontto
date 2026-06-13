import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

interface Beneficio {
  titulo: string;
  descricao: string;
  icone: string;
}

@Component({
  selector: 'app-para-prestadores',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './para-prestadores.component.html',
  styleUrl: './para-prestadores.component.scss',
})
export class ParaPrestadoresComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.atualizarSeo({
      titulo: 'Para Prestadores',
      descricao: 'Cadastre-se como prestador de serviços na Prontto e encontre clientes na sua região.',
      url: 'https://prontto.org/para-prestadores',
    });
  }

  readonly beneficios: Beneficio[] = [
    {
      titulo: 'Clientes qualificados',
      descricao: 'Receba solicitações de clientes sérios próximos a você.',
      icone: '👥',
    },
    {
      titulo: 'Pagamento seguro',
      descricao: 'Receba via Pix com segurança após conclusão do serviço.',
      icone: '🔒',
    },
    {
      titulo: 'Avaliações reais',
      descricao: 'Construa sua reputação com avaliações verificadas.',
      icone: '⭐',
    },
    {
      titulo: 'Gestão simplificada',
      descricao: 'Gerencie seus serviços pelo painel do prestador.',
      icone: '📊',
    },
  ];
}
