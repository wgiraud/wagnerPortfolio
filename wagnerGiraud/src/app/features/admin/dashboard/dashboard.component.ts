import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/application/state/auth-session.store';
import { PortfolioContentStore } from '../../../core/application/state/portfolio-content.store';
import { PortfolioContent } from '../../../core/domain/portfolio/portfolio-content.model';

type DashboardForm = FormGroup<{
  heroTitle: FormControl<string>;
  heroDescription: FormControl<string>;
  projects: FormControl<string>;
  skills: FormControl<string>;
  languages: FormControl<string>;
}>;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly portfolioContentStore = inject(PortfolioContentStore);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly router = inject(Router);

  protected readonly content = this.portfolioContentStore.content;
  protected readonly statusMessage = signal('');

  protected readonly form: DashboardForm = this.createForm(this.content());

  protected async logout(): Promise<void> {
    this.authSessionStore.endSession();
    await this.router.navigateByUrl('/welcome');
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const nextContent: PortfolioContent = {
      heroTitle: value.heroTitle.trim(),
      heroDescription: value.heroDescription.trim(),
      projects: this.parseList(value.projects),
      skills: this.parseList(value.skills),
      languages: this.parseList(value.languages)
    };

    this.portfolioContentStore.save(nextContent);
    this.statusMessage.set('Conteudo atualizado no welcome.');
  }

  protected restoreDefaults(): void {
    this.portfolioContentStore.reset();
    this.syncFormFromContent(this.content());
    this.statusMessage.set('Conteudo restaurado para o padrao.');
  }

  private createForm(content: PortfolioContent): DashboardForm {
    return new FormGroup({
      heroTitle: new FormControl(content.heroTitle, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      heroDescription: new FormControl(content.heroDescription, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      projects: new FormControl(this.joinList(content.projects), {
        nonNullable: true,
        validators: [Validators.required]
      }),
      skills: new FormControl(this.joinList(content.skills), {
        nonNullable: true,
        validators: [Validators.required]
      }),
      languages: new FormControl(this.joinList(content.languages), {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  private syncFormFromContent(content: PortfolioContent): void {
    this.form.setValue({
      heroTitle: content.heroTitle,
      heroDescription: content.heroDescription,
      projects: this.joinList(content.projects),
      skills: this.joinList(content.skills),
      languages: this.joinList(content.languages)
    });
  }

  private parseList(rawValue: string): string[] {
    return rawValue
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private joinList(items: string[]): string {
    return items.join('\n');
  }
}
