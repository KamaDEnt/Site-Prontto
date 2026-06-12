import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MinhaAreaComponent } from './minha-area.component';

describe('MinhaAreaComponent', () => {
  let componente: MinhaAreaComponent;
  let fixture: ComponentFixture<MinhaAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaAreaComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaAreaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve exibir a sidebar', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelector('.sidebar')).toBeTruthy();
  });

  it('deve exibir abas mobile', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelector('.abas-mobile')).toBeTruthy();
  });

  it('deve iniciar na aba de serviços para clientes', () => {
    expect(componente.abaAtiva()).toBe('servicos');
  });
});
