import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly auth = inject(AuthService);
  readonly menuAberto = signal(false);
  readonly scrollado = signal(false);

  alternarMenu(): void {
    this.menuAberto.update(v => !v);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.menuAberto.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollado.set(window.scrollY > 20);
  }
}
