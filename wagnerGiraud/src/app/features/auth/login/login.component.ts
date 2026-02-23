import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticatePortfolioOwnerUseCase } from '../../../core/application/use-cases/authenticate-portfolio-owner.use-case';
import { AuthSessionStore } from '../../../core/application/state/auth-session.store';

type LoginForm = FormGroup<{
  username: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly authenticatePortfolioOwnerUseCase = inject(AuthenticatePortfolioOwnerUseCase);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loginForm: LoginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected hasFieldError(field: 'username' | 'password'): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected async authenticate(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const hasAccess = await this.authenticatePortfolioOwnerUseCase.execute({
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      });

      if (!hasAccess) {
        this.errorMessage.set('Acesso negado. Verifique as credenciais.');
        return;
      }

      this.authSessionStore.startSession();

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const targetUrl = returnUrl && returnUrl !== '/login' ? returnUrl : '/dashboard';
      await this.router.navigateByUrl(targetUrl);
    } catch {
      this.errorMessage.set('Falha ao validar credenciais. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
