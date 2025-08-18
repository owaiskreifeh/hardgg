'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Game } from '@/types/game';
import { formatDate, truncateText, cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  className?: string;
}

export function GameCard({
  game,
  size,
  onClick,
  className = ''
}: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  const getCardClasses = () => {
    const baseClasses = 'gaming-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl';

    switch (size) {
      case 'small':
        return cn(baseClasses, 'p-2', className);
      case 'large':
        return cn(baseClasses, 'p-6', className);
      case 'medium':
      default:
        return cn(baseClasses, 'p-4', className);
    }
  };

  const getImageClasses = () => {
    switch (size) {
      case 'small':
        return 'w-full h-24 object-cover rounded-lg mb-2';
      case 'large':
        return 'w-full h-48 object-cover rounded-lg mb-4';
      case 'medium':
      default:
        return 'w-full h-32 object-cover rounded-lg mb-3';
    }
  };

  const getTitleClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm font-semibold mb-1 line-clamp-1';
      case 'large':
        return 'text-xl font-bold mb-2';
      case 'medium':
      default:
        return 'text-lg font-semibold mb-2 line-clamp-1';
    }
  };

  const getDescriptionClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs text-gray-400 line-clamp-2';
      case 'large':
        return 'text-base text-gray-300 mb-4 line-clamp-3';
      case 'medium':
      default:
        return 'text-sm text-gray-400 mb-3 line-clamp-2';
    }
  };

  const getTagClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs px-1 py-0.5';
      case 'large':
        return 'text-sm px-2 py-1';
      case 'medium':
      default:
        return 'text-xs px-1.5 py-0.5';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={getCardClasses()} onClick={onClick}>
      {/* Game Image */}
      <div className="relative">
        {!imageError ? (
          <Image
            src={game.image}
            alt={game.title}
            width={300}
            height={200}
            className={getImageClasses()}
            onError={handleImageError}
          />
        ) : (
          <div className={cn(getImageClasses(), 'bg-gaming-border flex items-center justify-center')}>
            <span className="text-4xl">🎮</span>
          </div>
        )}

        {/* Size Badge */}
        <div className="absolute top-2 right-2">
          <span className="gaming-badge text-xs px-2 py-1">
            {game.repackSize}
          </span>
        </div>
      </div>

      {/* Game Info */}
      <div>
        <h3 className={getTitleClasses()}>
          {size === 'small' ? truncateText(game.title, 20) : game.title}
        </h3>

        {size !== 'small' && (
          <p className={getDescriptionClasses()}>
            {truncateText(game.description, size === 'large' ? 150 : 80)}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {game.genre.slice(0, size === 'small' ? 1 : 2).map((genre) => (
            <span
              key={genre}
              className={cn('gaming-tag', getTagClasses())}
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(game.releaseDate)}</span>
          <span>{game.developer}</span>
        </div>

        {/* Size comparison for larger cards */}
        {size === 'large' && (
          <div className="mt-3 p-2 bg-gaming-bg-secondary rounded-lg">
            <div className="flex justify-between text-xs">
              <span>Original: {game.originalSize}</span>
              <span>Repack: {game.repackSize}</span>
            </div>
            <div className="w-full bg-gaming-border rounded-full h-1 mt-1">
              <div
                className="bg-gaming-primary h-1 rounded-full"
                style={{
                  width: `${(parseInt(game.repackSize) / parseInt(game.originalSize)) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
