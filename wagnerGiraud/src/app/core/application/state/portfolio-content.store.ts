import { Injectable, signal } from '@angular/core';
import {
  PortfolioContent,
  PortfolioProject,
} from '../../domain/portfolio/portfolio-content.model';

const REMOVED_HERO_TITLES = new Set<string>([
  'Engenheiro de Software Full Stack focado em solucoes modernas e escalaveis.',
]);

const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  heroTitle: '',
  heroDescription:
    'Engenheiro full stack com foco em Java, Angular e .NET para produtos corporativos de alta relevancia, com arquitetura limpa, SOLID e entrega continua.',
  projects: [
    {
      name: 'Portfolio oficial em Angular',
      description: 'Aplicacao portfolio responsiva com dashboard de edicao e deploy continuo.',
      url: 'https://github.com/wgiraud/wagnerPortfolio',
    },
    {
      name: 'Aplicacao full stack com Java 21 + Angular',
      description: 'Arquitetura orientada a microsservicos com foco em performance e resiliencia.',
    },
    {
      name: 'Projeto .NET + Angular para ambiente corporativo',
      description: 'Fluxos corporativos com integracoes, testes automatizados e entrega continua.',
    },
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
        projects: this.ensureProjects(
          parsed.projects,
          DEFAULT_PORTFOLIO_CONTENT.projects,
        ),
        skills: this.ensureStringArray(
          parsed.skills,
          DEFAULT_PORTFOLIO_CONTENT.skills,
        ),
        languages: this.ensureStringArray(
          parsed.languages,
          DEFAULT_PORTFOLIO_CONTENT.languages,
        ),
      };
    } catch {
      return DEFAULT_PORTFOLIO_CONTENT;
    }
  }

  private ensureStringArray(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) {
      return fallback;
    }

    const sanitized = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);

    return sanitized.length > 0 ? sanitized : fallback;
  }

  private ensureProjects(
    value: unknown,
    fallback: PortfolioProject[],
  ): PortfolioProject[] {
    if (!Array.isArray(value)) {
      return fallback;
    }

    const sanitized = value
      .map((item) => this.normalizeProject(item))
      .filter((item): item is PortfolioProject => item !== null);

    return sanitized.length > 0 ? sanitized : fallback;
  }

  private normalizeProject(value: unknown): PortfolioProject | null {
    if (typeof value === 'string') {
      return this.normalizeLegacyProjectString(value);
    }

    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const candidate = value as {
      name?: unknown;
      title?: unknown;
      description?: unknown;
      summary?: unknown;
      url?: unknown;
      link?: unknown;
      imageUrl?: unknown;
      image?: unknown;
      screenshot?: unknown;
    };

    const rawName =
      typeof candidate.name === 'string'
        ? candidate.name
        : typeof candidate.title === 'string'
          ? candidate.title
          : '';

    const name = rawName.trim();
    if (!name) {
      return null;
    }

    const rawDescription =
      typeof candidate.description === 'string'
        ? candidate.description
        : typeof candidate.summary === 'string'
          ? candidate.summary
          : '';

    const description = rawDescription.trim();
    const rawUrl =
      typeof candidate.url === 'string'
        ? candidate.url
        : typeof candidate.link === 'string'
          ? candidate.link
          : '';

    const url = this.normalizeProjectUrl(rawUrl);
    const rawImageUrl =
      typeof candidate.imageUrl === 'string'
        ? candidate.imageUrl
        : typeof candidate.image === 'string'
          ? candidate.image
          : typeof candidate.screenshot === 'string'
            ? candidate.screenshot
            : '';

    const imageUrl = this.normalizeProjectImageUrl(rawImageUrl);
    return {
      name,
      ...(description ? { description } : {}),
      ...(url ? { url } : {}),
      ...(imageUrl ? { imageUrl } : {}),
    };
  }

  private normalizeLegacyProjectString(value: string): PortfolioProject | null {
    const [namePart = '', secondPart = '', thirdPart = ''] = value
      .split('|')
      .map((part) => part.trim());

    const name = namePart.trim();
    if (!name) {
      return null;
    }

    if (!secondPart && !thirdPart) {
      return { name };
    }

    if (thirdPart) {
      const url = this.normalizeProjectUrl(secondPart);
      const imageUrl = this.normalizeProjectImageUrl(thirdPart);

      return { name, ...(url ? { url } : {}), ...(imageUrl ? { imageUrl } : {}) };
    }

    const parsedUrl = this.normalizeProjectUrl(secondPart);
    if (parsedUrl) {
      return { name, url: parsedUrl };
    }

    const imageUrl = this.normalizeProjectImageUrl(secondPart);
    return { name, ...(imageUrl ? { imageUrl } : {}) };
  }

  private normalizeProjectUrl(value: string): string | undefined {
    const url = value.trim();
    if (!url) {
      return undefined;
    }

    return /^https?:\/\//i.test(url) ? url : undefined;
  }

  private normalizeProjectImageUrl(value: string): string | undefined {
    const url = value.trim();
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

  private sanitizeHeroTitle(value: string): string {
    const title = value.trim();
    return REMOVED_HERO_TITLES.has(title) ? '' : title;
  }

  private persistContent(content: PortfolioContent): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(content));
    } catch {
      // Keep app usable when localStorage quota is exceeded by large inline images.
    }
  }
}
