import { Injectable, signal } from '@angular/core';
import { PortfolioContent } from '../../domain/portfolio/portfolio-content.model';

const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  heroTitle: 'Bem-vindo ao portfolio oficial.',
  heroDescription:
    'Explore projetos, stack e evolucao tecnica. O acesso administrativo fica no login superior.',
  projects: ['Projeto Portfolio Angular', 'Landing pages de alta conversao', 'Automacoes com CI/CD'],
  skills: ['Arquitetura Frontend', 'UI/UX focado em conversao', 'Boas praticas de performance'],
  languages: ['TypeScript', 'JavaScript', 'HTML', 'SCSS']
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
        heroTitle: parsed.heroTitle ?? DEFAULT_PORTFOLIO_CONTENT.heroTitle,
        heroDescription: parsed.heroDescription ?? DEFAULT_PORTFOLIO_CONTENT.heroDescription,
        projects: this.ensureArray(parsed.projects, DEFAULT_PORTFOLIO_CONTENT.projects),
        skills: this.ensureArray(parsed.skills, DEFAULT_PORTFOLIO_CONTENT.skills),
        languages: this.ensureArray(parsed.languages, DEFAULT_PORTFOLIO_CONTENT.languages)
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

  private persistContent(content: PortfolioContent): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(content));
  }
}
