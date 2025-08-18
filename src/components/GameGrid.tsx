'use client';

import { Game } from '@/types/game';
import { GameCard } from './GameCard';
import { cn } from '@/lib/utils';

interface GameGridProps {
  games: Game[];
  gridSize: 'small' | 'medium' | 'large';
  onGameClick: (game: Game) => void;
  className?: string;
}

export function GameGrid({
  games,
  gridSize,
  onGameClick,
  className = ''
}: GameGridProps) {
  const getGridClasses = () => {
    switch (gridSize) {
      case 'small':
        return 'gaming-grid-small';
      case 'large':
        return 'gaming-grid-large';
      case 'medium':
      default:
        return 'gaming-grid-medium';
    }
  };

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No games found
        </h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your search terms or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {games.map((game, index) => (
        <GameCard
          key={`${game.title}-${index}`}
          game={game}
          size={gridSize}
          onClick={() => onGameClick(game)}
        />
      ))}
    </div>
  );
}
