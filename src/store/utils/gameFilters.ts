import { SearchState } from '../slices/searchSlice';
import { Game } from '@/types/game';
import { parseSizeToMB } from '@/lib/utils';

export const filterAndSortGames = (games: Game[], searchState: SearchState): Game[] => {
  let filtered = [...games];

  // Apply search filter
  if (searchState.query) {
    const query = searchState.query.toLowerCase();
    filtered = filtered.filter(game =>
      game.title.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.genre.some(genre => genre.toLowerCase().includes(query)) ||
      game.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply genre filter
  if (searchState.filters.genre && searchState.filters.genre.length > 0) {
    filtered = filtered.filter(game =>
      searchState.filters.genre!.some(genre =>
        game.genre.includes(genre) || game.tags.includes(genre)
      )
    );
  }

  // Apply size filter
  if (searchState.filters.size) {
    filtered = filtered.filter(game => {
      const gameSize = parseSizeToMB(game.size);
      const filterSize = parseSizeToMB(searchState.filters.size!);
      return gameSize <= filterSize;
    });
  }

  // Apply language filter
  if (searchState.filters.language && searchState.filters.language.length > 0) {
    filtered = filtered.filter(game =>
      searchState.filters.language!.some(lang =>
        game.language.includes(lang)
      )
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;

    switch (searchState.sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'releaseDate':
        aValue = new Date(a.releaseDate);
        bValue = new Date(b.releaseDate);
        break;
      case 'size':
        aValue = parseSizeToMB(a.size);
        bValue = parseSizeToMB(b.size);
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (searchState.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

export const getUniqueGenres = (games: Game[]): string[] => {
  const genres = new Set<string>();
  games.forEach(game => {
    game.genre.forEach(genre => genres.add(genre));
    game.tags.forEach(tag => genres.add(tag));
  });
  return Array.from(genres).sort();
};

export const getUniqueLanguages = (games: Game[]): string[] => {
  const languages = new Set<string>();
  games.forEach(game => {
    game.language.forEach(lang => languages.add(lang));
  });
  return Array.from(languages).sort();
};

export const getSizeRanges = (games: Game[]): string[] => {
  const sizes = games.map(game => game.size);
  const uniqueSizes = [...new Set(sizes)].sort((a, b) => {
    const aSize = parseSizeToMB(a);
    const bSize = parseSizeToMB(b);
    return aSize - bSize;
  });
  return uniqueSizes;
};
