import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private readonly portfolioContentStore = inject(PortfolioContentStore);
  private readonly authSessionStore = inject(AuthSessionStore);

  protected readonly quickNav = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Sobre' },
    { id: 'journey', label: 'Trajetoria' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'stack', label: 'Stack' }
  ];

  protected readonly profile = {
    name: 'Wagner Giraud',
    email: 'wagner_giraud@outlook.com',
    linkedin: 'https://www.linkedin.com/in/wagner-giraud-pcd-a743b6196/',
    github: 'https://github.com/wgiraud',
    location: 'Sao Paulo - SP',
    accessibility: 'PCD | Deficiencia Auditiva Bilateral'
  };

  protected readonly aboutParagraphs = [
    'Engenheiro de Software Full Stack com experiencia em modernizacao de sistemas legados e evolucao de plataformas escalaveis.',
    'Atuacao com Java (Spring Boot), Angular e .NET em projetos estrategicos para empresas de grande porte.',
    'Foco em arquitetura limpa/hexagonal, principios SOLID, CI/CD, testes automatizados e entrega continua orientada a impacto de negocio.'
  ];

  protected readonly journey: JourneyItem[] = [
    {
      role: 'Engenheiro de Software Full Stack',
      company: 'Bradesco',
      period: '2026 - Atual',
      location: 'Sao Paulo/SP',
      outcomes: [
        'Atuacao em evolucao de produtos digitais com foco em escalabilidade e resiliencia.',
        'Construcao de solucoes full stack com boas praticas de arquitetura e qualidade.',
        'Colaboracao com times multidisciplinares em fluxo agil e entrega continua.'
      ]
    },
    {
      role: 'Engenheiro de Software',
      company: 'Itau Unibanco',
      period: '2024 - 2025',
      location: 'Sao Paulo/SP | Hibrido',
      outcomes: [
        'Modernizacao de sistemas legados com Java 21 (Spring Boot) e Angular.',
        'Desenvolvimento de microsservicos e arquitetura de Micro Frontends.',
        'Integracao com CMS Headless, testes com Jest/Cypress e CI/CD com GitHub Actions.'
      ]
    },
    {
      role: 'Desenvolvedor Full Stack',
      company: 'EY (Ernst & Young)',
      period: '2022 - 2024',
      location: 'Sao Paulo/SP | Remoto',
      outcomes: [
        'Atuacao em transformacao digital para multinacional de energia.',
        'Evolucao de solucoes em .NET Framework, NHibernate e Angular.',
        'Otimizacao de queries, integracoes corporativas e melhorias de usabilidade/performance.'
      ]
    },
    {
      role: 'Desenvolvedor Full Stack',
      company: 'Henrique Hipolito Rodrigues Bizarria de Morais ME',
      period: '2017 - 2022',
      location: 'Sao Paulo/SP | Remoto',
      outcomes: [
        'Desenvolvimento de sistemas web com Angular, .NET 4, ASP.NET MVC e SQL Server.',
        'Entrega continua com Git e Jenkins em fluxo Scrum.',
        'Contribuicao em projetos full stack para diferentes contextos de negocio.'
      ]
    }
  ];

  protected readonly highlights: HighlightItem[] = [
    {
      title: 'Modernizacao Estrategica',
      detail: 'Legados evoluidos para arquiteturas escalaveis com menor risco de operacao.'
    },
    {
      title: 'Engenharia de Qualidade',
      detail: 'Aplicacao consistente de SOLID, testes automatizados e pipelines robustos.'
    },
    {
      title: 'Entrega de Valor',
      detail: 'Foco em performance, observabilidade e experiencia real de produto.'
    }
  ];

  protected readonly stackGroups: StackGroup[] = [
    {
      title: 'Linguagens',
      items: [
        { label: 'Java', iconSlug: 'openjdk', monogram: 'JV' },
        { label: 'TypeScript', iconSlug: 'typescript', monogram: 'TS' },
        { label: 'C#', iconSlug: 'csharp', monogram: 'C#' }
      ]
    },
    {
      title: 'Frameworks',
      items: [
        { label: 'Spring Boot', iconSlug: 'springboot', monogram: 'SB' },
        { label: 'Angular', iconSlug: 'angular', monogram: 'NG' },
        { label: '.NET Framework', iconSlug: 'dotnet', monogram: '.N' },
        { label: 'NHibernate', monogram: 'NH' }
      ]
    },
    {
      title: 'Ferramentas',
      items: [
        { label: 'GitHub Actions', iconSlug: 'githubactions', monogram: 'GH' },
        { label: 'Jenkins', iconSlug: 'jenkins', monogram: 'JK' },
        { label: 'Scrum', monogram: 'SC' },
        { label: 'SonarQube', iconSlug: 'sonarqube', monogram: 'SQ' },
        { label: 'Datadog', iconSlug: 'datadog', monogram: 'DD' },
        { label: 'Jest', iconSlug: 'jest', monogram: 'JT' },
        { label: 'Cypress', iconSlug: 'cypress', monogram: 'CY' }
      ]
    },
    {
      title: 'Dados',
      items: [
        { label: 'PostgreSQL', iconSlug: 'postgresql', monogram: 'PG' },
        { label: 'SQL Server', iconSlug: 'microsoftsqlserver', monogram: 'MS' },
        { label: 'MongoDB', iconSlug: 'mongodb', monogram: 'MG' },
        { label: 'Redis', iconSlug: 'redis', monogram: 'RD' }
      ]
    }
  ];

  protected readonly content = this.portfolioContentStore.content;
  protected readonly isAuthenticated = this.authSessionStore.isAuthenticated;

  protected onTechIconError(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    target.classList.add('stack-logo--hidden');

    const fallback = target.nextElementSibling;
    if (fallback instanceof HTMLElement) {
      fallback.classList.add('stack-logo-fallback--visible');
    }
  }
}
