export interface PortfolioProject {
  name: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export interface PortfolioContent {
  heroTitle: string;
  heroDescription: string;
  projects: PortfolioProject[];
  skills: string[];
  languages: string[];
}
