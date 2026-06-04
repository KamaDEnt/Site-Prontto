import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PerfilPrestadorComponent } from './perfil-prestador.component';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { AuthService } from '../../core/auth/auth.service';
import { PerfilPublico } from '../../core/models/usuario.model';

const perfilMock: PerfilPublico = {
  id: 'uuid-1',
  nome: 'João Silva',
  fotoPerfilUrl: null,
  slug: 'joao-silva-a1b2',
  descricao: 'Especialista em instalações elétricas.',
  especialidade: 'Eletricista',
  mediaAvaliacoes: 4.5,
  totalAvaliacoes: 12,
  categorias: [{ id: 'cat-1', nome: 'Eletricista', slug: 'eletricista' }],
  cidades: [{ id: 'cid-1', nome: 'Itapevi', estado: 'SP', slug: 'itapevi' }],
  imagensPortfolio: [],
};

describe('PerfilPrestadorComponent', () => {
  let component: PerfilPrestadorComponent;
  let fixture: ComponentFixture<PerfilPrestadorComponent>;
  let serviceSpy: jasmine.SpyObj<PerfilPrestadorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('PerfilPrestadorService', ['obterPerfilPublico']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/prestador/joao-silva-a1b2' });

    serviceSpy.obterPerfilPublico.and.returnValue(of(perfilMock));

    await TestBed.configureTestingModule({
      imports: [PerfilPrestadorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'joao-silva-a1b2' } } },
        },
        { provide: Router, useValue: routerSpy },
        { provide: PerfilPrestadorService, useValue: serviceSpy },
        {
          provide: AuthService,
          useValue: { usuario: () => null },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPrestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o perfil após carregar', () => {
    expect(component.perfil()).toEqual(perfilMock);
    expect(component.carregando()).toBeFalse();
    expect(component.erro()).toBeNull();
  });

  it('deve exibir erro 404 quando prestador não for encontrado', () => {
    serviceSpy.obterPerfilPublico.and.returnValue(throwError(() => ({ status: 404 })));
    component.ngOnInit();
    expect(component.erro()).toBe('Prestador não encontrado.');
    expect(component.perfil()).toBeNull();
  });

  it('deve redirecionar para /entrar ao contratar sem autenticação', () => {
    component.contratar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/entrar'],
      jasmine.objectContaining({ queryParams: { returnUrl: jasmine.any(String) } }),
    );
  });

  it('deve calcular estrelas corretamente', () => {
    expect(component.estrelas.length).toBe(5);
    // Média 4.5 → arredonda para 5 estrelas ativas
    expect(component.estralaAtiva(5)).toBeTrue();
    expect(component.estralaAtiva(1)).toBeTrue();
  });
});
