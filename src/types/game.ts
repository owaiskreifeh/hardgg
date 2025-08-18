export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  size: string;
  genre: string[];
  tags: string[];
  releaseDate: string;
  developer: string;
  publisher: string;
  language: string[];
  repackSize: string;
  originalSize: string;
  downloadLinks: {
    magnet?: string;
    torrent?: string;
    direct?: string;
  };
  systemRequirements: {
    minimum: SystemRequirement;
    recommended?: SystemRequirement;
  };
  features: string[];
  notes?: string;
  screenshots?: string[];
}

export interface SystemRequirement {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
  additional?: string;
}

export interface GameFilter {
  genre?: string[];
  tags?: string[];
  size?: string;
  language?: string[];
  developer?: string;
  publisher?: string;
}

export interface SearchState {
  query: string;
  filters: GameFilter;
  sortBy: 'title' | 'releaseDate' | 'size' | 'popularity';
  sortOrder: 'asc' | 'desc';
  gridSize: 'small' | 'medium' | 'large';
}

export interface GameState {
  games: Game[];
  filteredGames: Game[];
  loading: boolean;
  error: string | null;
  selectedGame: Game | null;
  searchState: SearchState;
}
