import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/application/state/auth-session.store';
import { PortfolioContentStore } from '../../../core/application/state/portfolio-content.store';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private readonly portfolioContentStore = inject(PortfolioContentStore);
  private readonly authSessionStore = inject(AuthSessionStore);

  protected readonly quickNav = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projetos' },
    { id: 'skills', label: 'Skills' },
    { id: 'stack', label: 'Stack' }
  ];

  protected readonly content = this.portfolioContentStore.content;
  protected readonly isAuthenticated = this.authSessionStore.isAuthenticated;
}
