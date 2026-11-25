import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUILD_INFO } from '../../../core/generated/build-info';
import { AuthSessionStore } from '../../../core/application/state/auth-session.store';
import { PortfolioContentStore } from '../../../core/application/state/portfolio-content.store';

type JourneyItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  outcomes: string[];
};

type HighlightItem = {
  title: string;
  detail: string;
};

type StackItem = {
  label: string;
  iconSlug?: string;
  monogram?: string;
};

type StackGroup = {
  title: string;
  items: StackItem[];
};

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {
  private readonly portfolioContentStore = inject(PortfolioContentStore);
  private readonly authSessionStore = inject(AuthSessionStore);
  protected readonly isProjectsExpanded = signal(true);

  protected readonly buildInfo = BUILD_INFO;

  protected readonly profile = {
    name: 'Wagner Giraud',
    email: 'wagner_giraud@outlook.com',
    linkedin: 'https://www.linkedin.com/in/wagner-giraud-pcd-a743b6196/',
    github: 'https://github.com/wgiraud',
    whatsapp: 'https://wa.me/5513996001094',
    location: 'São Paulo, Brasil',
    accessibility: 'PCD | Deficiência auditiva bilateral',
  };

  protected readonly aboutParagraphs = [
    'Engenheiro de Software com trajetória em tecnologia desde 2017, atuando na modernização de sistemas e na evolução de produtos digitais.',
    'Experiência com Java, Spring Boot, Angular e .NET em ambientes corporativos, incluindo o setor financeiro.',
    'Foco em arquitetura limpa e hexagonal, SOLID, integração contínua, testes automatizados e soluções que atendam necessidades reais de negócio.',
  ];

  protected readonly journey: JourneyItem[] = [
    {
      role: 'Engenheiro de Software Full Stack',
      company: 'Bradesco',
      period: 'Dez 2025 — Atual',
      location: 'São Paulo/SP',
      outcomes: [
        'Atuação em evolução de produtos digitais com foco em escalabilidade e resiliência.',
        'Construção de soluções full stack com boas praticas de arquitetura e qualidade.',
        'Colaboração com times multidisciplinares em fluxo ágil e entrega contínua.',
      ],
    },
    {
      role: 'Engenheiro de Software',
      company: 'Itau Unibanco',
      period: '2024 - 2025',
      location: 'São Paulo/SP | Híbrido',
      outcomes: [
        'Modernização de sistemas legados com Java 21 (Spring Boot) e Angular.',
        'Desenvolvimento de microsserviços e arquitetura de Micro Frontends.',
        'Integração com CMS Headless, testes com Jest/Cypress e CI/CD com GitHub Actions.',
      ],
    },
    {
      role: 'Desenvolvedor Full Stack',
      company: 'EY (Ernst & Young)',
      period: '2022 - 2024',
      location: 'São Paulo/SP | Remoto',
      outcomes: [
        'Atuação em transformação digital para multinacional de energia.',
        'Evolucao de soluções em .NET Framework, NHibernate e Angular.',
        'Otimização de queries, integrações corporativas e melhorias de usabilidade/performance.',
      ],
    },
    {
      role: 'Desenvolvedor Full Stack',
      company: 'HJJB Tecnologia',
      period: '2017 - 2022',
      location: 'São Paulo/SP | Remoto',
      outcomes: [
        'Desenvolvimento de sistemas web com Angular, .NET 4, ASP.NET MVC e SQL Server.',
        'Entrega contínua com Git e Jenkins em fluxo Scrum.',
        'Contribuicao em projetos full stack para diferentes contextos de negócio.',
      ],
    },
  ];

  protected readonly highlights: HighlightItem[] = [
    {
      title: 'Modernização de sistemas',
      detail:
        'Evolução de sistemas legados com foco em arquitetura e manutenção.',
    },
    {
      title: 'Qualidade de engenharia',
      detail:
        'SOLID, testes automatizados e integração contínua.',
    },
    {
      title: 'Entrega de valor',
      detail:
        'Performance, observabilidade e experiência de produto.',
    },
  ];

  protected readonly stackGroups: StackGroup[] = [
    {
      title: 'Linguagens',
      items: [
        { label: 'Java 21', iconSlug: 'openjdk', monogram: 'JV' },
        { label: 'TypeScript', iconSlug: 'typescript', monogram: 'TS' },
        { label: 'C#', iconSlug: 'csharp', monogram: 'C#' },
      ],
    },
    {
      title: 'Frameworks',
      items: [
        { label: 'Spring Boot', iconSlug: 'springboot', monogram: 'SB' },
        { label: 'Angular', iconSlug: 'angular', monogram: 'NG' },
        { label: '.NET Framework', iconSlug: 'dotnet', monogram: '.N' },
        { label: 'NHibernate', monogram: 'NH' },
      ],
    },
    {
      title: 'Ferramentas',
      items: [
        { label: 'GitHub Actions', iconSlug: 'githubactions', monogram: 'GH' },
        { label: 'Jenkins', iconSlug: 'jenkins', monogram: 'JK' },
        { label: 'Scrum', monogram: 'SC' },
        { label: 'SonarQube', iconSlug: 'sonarqube', monogram: 'SQ' },
        { label: 'Datadog', iconSlug: 'datadog', monogram: 'DD' },
        { label: 'Docker', monogram: 'DK' },
        { label: 'Azure', monogram: 'AZ' },
        { label: 'Dynatrace', monogram: 'DT' },
        { label: 'Playwright', monogram: 'PW' },
        { label: 'Jest', iconSlug: 'jest', monogram: 'JT' },
        { label: 'Cypress', iconSlug: 'cypress', monogram: 'CY' },
      ],
    },
    {
      title: 'Dados',
      items: [
        { label: 'PostgreSQL', iconSlug: 'postgresql', monogram: 'PG' },
        { label: 'SQL Server', iconSlug: 'microsoftsqlserver', monogram: 'MS' },
        { label: 'MongoDB', iconSlug: 'mongodb', monogram: 'MG' },
        { label: 'Redis', iconSlug: 'redis', monogram: 'RD' },
        { label: 'Kafka', monogram: 'KF' },
      ],
    },
  ];

  protected readonly content = this.portfolioContentStore.content;
  protected readonly isAuthenticated = this.authSessionStore.isAuthenticated;

  protected toggleProjectsDropdown(): void {
    this.isProjectsExpanded.update((value) => !value);
  }

  protected projectWhatsapp(projectName: string): string {
    const message = `Olá, Wagner! Vi seu portfólio e gostaria de saber mais sobre o projeto ${projectName}.`;
    return `${this.profile.whatsapp}?text=${encodeURIComponent(message)}`;
  }
}
