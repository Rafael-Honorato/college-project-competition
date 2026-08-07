import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected isMenuOpen = signal(false);

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onLoggout(): void {
    this.authService.loggout();
    this.router.navigate(['/home']);
  }

  userImg(): string {
    return 'user-icon.png';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isMenuOpen()) this.closeMenu();
  }

  @HostListener('document:keydown.scape')
  onEscapeKey(): void {
    this.closeMenu();
  }
}
