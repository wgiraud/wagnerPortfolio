import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/application/state/auth-session.store';
import { PortfolioContentStore } from '../../../core/application/state/portfolio-content.store';
import {
  PortfolioContent,
  PortfolioProject
} from '../../../core/domain/portfolio/portfolio-content.model';

type DashboardForm = FormGroup<{
  heroTitle: FormControl<string>;
  heroDescription: FormControl<string>;
  projectDraft: ProjectFormGroup;
  skills: FormControl<string>;
  languages: FormControl<string>;
}>;

type ProjectFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}>;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  protected removeProject(index: number): void {
    const currentContent = this.content();
    const currentProjects = currentContent.projects;
    if (index < 0 || index >= currentProjects.length) {
      return;
    }

    const nextProjects = currentProjects.filter((_, projectIndex) => projectIndex !== index);
    this.portfolioContentStore.save({
      ...currentContent,
      projects: nextProjects
    });
    this.statusMessage.set('Projeto removido.');
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const draftProject = this.parseProject(this.form.controls.projectDraft.getRawValue());
    const currentProjects = this.content().projects;
    const nextProjects = draftProject ? [...currentProjects, draftProject] : currentProjects;

    this.portfolioContentStore.save(this.buildContent(nextProjects));

    if (draftProject) {
      this.resetProjectDraft();
      this.statusMessage.set('Projeto salvo. Formulario pronto para o proximo cadastro.');
      return;
    }

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
        nonNullable: true
      }),
      heroDescription: new FormControl(content.heroDescription, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      projectDraft: this.createProjectGroup(),
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
    this.form.controls.heroTitle.setValue(content.heroTitle);
    this.form.controls.heroDescription.setValue(content.heroDescription);
    this.form.controls.skills.setValue(this.joinList(content.skills));
    this.form.controls.languages.setValue(this.joinList(content.languages));
    this.resetProjectDraft();
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

  private createProjectGroup(project?: PortfolioProject): ProjectFormGroup {
    return new FormGroup({
      name: new FormControl(project?.name ?? '', {
        nonNullable: true
      }),
      description: new FormControl(project?.description ?? '', {
        nonNullable: true
      }),
      url: new FormControl(project?.url ?? '', {
        nonNullable: true
      })
    });
  }

  private parseProject(project: {
    name: string;
    description: string;
    url: string;
  }): PortfolioProject | null {
    const name = project.name.trim();
    if (!name) {
      return null;
    }

    const description = project.description.trim();
    const url = this.normalizeProjectUrl(project.url);

    return {
      name,
      ...(description ? { description } : {}),
      ...(url ? { url } : {})
    };
  }

  private buildContent(projects: PortfolioProject[]): PortfolioContent {
    const value = this.form.getRawValue();
    return {
      heroTitle: value.heroTitle.trim(),
      heroDescription: value.heroDescription.trim(),
      projects,
      skills: this.parseList(value.skills),
      languages: this.parseList(value.languages)
    };
  }

  private resetProjectDraft(): void {
    this.form.controls.projectDraft.setValue({
      name: '',
      description: '',
      url: ''
    });
    this.form.controls.projectDraft.markAsPristine();
    this.form.controls.projectDraft.markAsUntouched();
  }

  private normalizeProjectUrl(rawUrl: string): string | undefined {
    const url = rawUrl.trim();
    if (!url) {
      return undefined;
    }

    return /^https?:\/\//i.test(url) ? url : undefined;
  }
}
