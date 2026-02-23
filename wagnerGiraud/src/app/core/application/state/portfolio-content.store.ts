import { Injectable, signal } from '@angular/core';
import { PortfolioContent } from '../../domain/portfolio/portfolio-content.model';

const REMOVED_HERO_TITLES = new Set<string>([
  'Engenheiro de Software Full Stack focado em solucoes modernas e escalaveis.',
]);

const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  heroTitle: '',
  heroDescription:
    'Engenheiro full stack com foco em Java, Angular e .NET para produtos corporativos de alta relevancia, com arquitetura limpa, SOLID e entrega continua.',
  projects: [
    'Modernizacao de legados no Itau com Java 21, Spring Boot e Angular.',
    'Transformacao digital na EY com integracoes corporativas e ganho de performance.',
    'Construcoes full stack com Angular + .NET + SQL Server em ambientes de entrega continua.',
  ],
  skills: [
    'Microsservicos, Micro Frontends e design patterns.',
    'Testes automatizados com Jest e Cypress.',
    'CI/CD com GitHub Actions e observabilidade com Datadog.',
  ],
  languages: ['Java', 'TypeScript', 'C#'],
};

@Injectable({ providedIn: 'root' })
export class PortfolioContentStore {
  private readonly storageKey = 'wg-portfolio-content-v1';
  private readonly contentState = signal<PortfolioContent>(this.loadContent());

  readonly content = this.contentState.asReadonly();

  save(content: PortfolioContent): void {
    this.contentState.set(content);
    this.persistContent(content);
  }

  reset(): void {
    this.save(DEFAULT_PORTFOLIO_CONTENT);
  }

  private loadContent(): PortfolioContent {
    if (typeof window === 'undefined') {
      return DEFAULT_PORTFOLIO_CONTENT;
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return DEFAULT_PORTFOLIO_CONTENT;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PortfolioContent>;
      return {
        heroTitle: this.sanitizeHeroTitle(
          parsed.heroTitle ?? DEFAULT_PORTFOLIO_CONTENT.heroTitle,
        ),
        heroDescription:
          parsed.heroDescription ?? DEFAULT_PORTFOLIO_CONTENT.heroDescription,
        projects: this.ensureArray(
          parsed.projects,
          DEFAULT_PORTFOLIO_CONTENT.projects,
        ),
        skills: this.ensureArray(
          parsed.skills,
          DEFAULT_PORTFOLIO_CONTENT.skills,
        ),
        languages: this.ensureArray(
          parsed.languages,
          DEFAULT_PORTFOLIO_CONTENT.languages,
        ),
      };
    } catch {
      return DEFAULT_PORTFOLIO_CONTENT;
    }
  }

  private ensureArray(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) {
      return fallback;
    }

    const sanitized = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);

    return sanitized.length > 0 ? sanitized : fallback;
  }

  private sanitizeHeroTitle(value: string): string {
    const title = value.trim();
    return REMOVED_HERO_TITLES.has(title) ? '' : title;
  }

  private persistContent(content: PortfolioContent): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(content));
  }
}
