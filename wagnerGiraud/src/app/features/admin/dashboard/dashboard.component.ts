import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
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
  projects: FormArray<ProjectFormGroup>;
  skills: FormControl<string>;
  languages: FormControl<string>;
}>;

type ProjectFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
  imageUrl: FormControl<string>;
}>;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly maxProjectImageBytes = 1_200_000;
  private readonly maxProjectImageMb = this.maxProjectImageBytes / (1024 * 1024);
  private readonly portfolioContentStore = inject(PortfolioContentStore);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly router = inject(Router);

  protected readonly content = this.portfolioContentStore.content;
  protected readonly statusMessage = signal('');

  protected readonly form: DashboardForm = this.createForm(this.content());
  protected get projectForms(): ProjectFormGroup[] {
    return this.form.controls.projects.controls;
  }

  protected async logout(): Promise<void> {
    this.authSessionStore.endSession();
    await this.router.navigateByUrl('/welcome');
  }

  protected addProject(): void {
    this.form.controls.projects.push(this.createProjectGroup());
  }

  protected removeProject(index: number): void {
    if (this.form.controls.projects.length <= 1) {
      return;
    }

    this.form.controls.projects.removeAt(index);
  }

  protected onProjectImageSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.statusMessage.set('Selecione um arquivo de imagem valido.');
      input.value = '';
      return;
    }

    if (file.size > this.maxProjectImageBytes) {
      this.statusMessage.set(
        `Imagem acima do limite. Use ate ${this.maxProjectImageMb.toFixed(1)} MB.`
      );
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        this.statusMessage.set('Falha ao processar a imagem selecionada.');
        return;
      }

      const projectForm = this.form.controls.projects.at(index);
      projectForm.controls.imageUrl.setValue(reader.result);
      projectForm.controls.imageUrl.markAsDirty();
      this.statusMessage.set(`Imagem do projeto ${index + 1} carregada com sucesso.`);
      input.value = '';
    };

    reader.onerror = () => {
      this.statusMessage.set('Falha ao ler o arquivo da imagem.');
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

  protected clearProjectImage(index: number): void {
    const projectForm = this.form.controls.projects.at(index);
    projectForm.controls.imageUrl.setValue('');
    projectForm.controls.imageUrl.markAsDirty();
    this.statusMessage.set(`Imagem do projeto ${index + 1} removida.`);
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
      projects: this.parseProjectList(this.projectForms),
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
        nonNullable: true
      }),
      heroDescription: new FormControl(content.heroDescription, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      projects: this.createProjectArray(content.projects),
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

    const projectArray = this.form.controls.projects;
    projectArray.clear();

    if (content.projects.length === 0) {
      projectArray.push(this.createProjectGroup());
      return;
    }

    content.projects.forEach((project) => projectArray.push(this.createProjectGroup(project)));
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

  private createProjectArray(projects: PortfolioProject[]): FormArray<ProjectFormGroup> {
    const groups =
      projects.length > 0
        ? projects.map((project) => this.createProjectGroup(project))
        : [this.createProjectGroup()];

    return new FormArray<ProjectFormGroup>(groups);
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
      }),
      imageUrl: new FormControl(project?.imageUrl ?? '', {
        nonNullable: true
      })
    });
  }

  private parseProjectList(projectForms: ProjectFormGroup[]): PortfolioProject[] {
    return projectForms
      .map((group) => group.getRawValue())
      .map((project) => {
        const name = project.name.trim();
        if (!name) {
          return null;
        }

        const description = project.description.trim();
        const url = this.normalizeProjectUrl(project.url);
        const imageUrl = this.normalizeProjectImageUrl(project.imageUrl);

        return {
          name,
          ...(description ? { description } : {}),
          ...(url ? { url } : {}),
          ...(imageUrl ? { imageUrl } : {})
        };
      })
      .filter((item): item is PortfolioProject => item !== null);
  }

  private normalizeProjectUrl(rawUrl: string): string | undefined {
    const url = rawUrl.trim();
    if (!url) {
      return undefined;
    }

    return /^https?:\/\//i.test(url) ? url : undefined;
  }

  private normalizeProjectImageUrl(rawUrl: string): string | undefined {
    const url = rawUrl.trim();
    if (!url) {
      return undefined;
    }

    if (/^javascript:/i.test(url)) {
      return undefined;
    }

    if (/^data:/i.test(url) && !/^data:image\//i.test(url)) {
      return undefined;
    }

    return url;
  }
}
