'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Download, ExternalLink, Calendar, HardDrive, Users, Globe } from 'lucide-react';
import { Game } from '@/types/game';
import { formatDate } from '@/lib/utils';

interface GameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="gaming-modal" onClick={handleBackdropClick}>
      <div className="gaming-modal-content">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{game.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div>
            <div className="relative mb-4">
              <Image
                src={game.image}
                alt={game.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <span className="gaming-badge px-3 py-1">
                  {game.repackSize}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="gaming-card p-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Calendar size={16} />
                  Release Date
                </div>
                <div className="text-white font-medium">
                  {formatDate(game.releaseDate)}
                </div>
              </div>

              <div className="gaming-card p-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <HardDrive size={16} />
                  Original Size
                </div>
                <div className="text-white font-medium">
                  {game.originalSize}
                </div>
              </div>

              <div className="gaming-card p-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Users size={16} />
                  Developer
                </div>
                <div className="text-white font-medium">
                  {game.developer}
                </div>
              </div>

              <div className="gaming-card p-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Globe size={16} />
                  Publisher
                </div>
                <div className="text-white font-medium">
                  {game.publisher}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Genres and Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {game.genre.map((genre) => (
                  <span key={genre} className="gaming-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span key={tag} className="gaming-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {game.language.map((lang) => (
                  <span key={lang} className="gaming-tag">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            {game.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                <ul className="space-y-1">
                  {game.features.map((feature) => (
                    <li key={feature} className="text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gaming-primary rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gaming-card p-4">
              <h4 className="text-md font-semibold text-gaming-primary mb-3">Minimum</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400">OS:</span> {game.systemRequirements.minimum.os}</div>
                <div><span className="text-gray-400">Processor:</span> {game.systemRequirements.minimum.processor}</div>
                <div><span className="text-gray-400">Memory:</span> {game.systemRequirements.minimum.memory}</div>
                <div><span className="text-gray-400">Graphics:</span> {game.systemRequirements.minimum.graphics}</div>
                <div><span className="text-gray-400">Storage:</span> {game.systemRequirements.minimum.storage}</div>
                {game.systemRequirements.minimum.additional && (
                  <div><span className="text-gray-400">Additional:</span> {game.systemRequirements.minimum.additional}</div>
                )}
              </div>
            </div>

            {game.systemRequirements.recommended && (
              <div className="gaming-card p-4">
                <h4 className="text-md font-semibold text-gaming-primary mb-3">Recommended</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">OS:</span> {game.systemRequirements.recommended.os}</div>
                  <div><span className="text-gray-400">Processor:</span> {game.systemRequirements.recommended.processor}</div>
                  <div><span className="text-gray-400">Memory:</span> {game.systemRequirements.recommended.memory}</div>
                  <div><span className="text-gray-400">Graphics:</span> {game.systemRequirements.recommended.graphics}</div>
                  <div><span className="text-gray-400">Storage:</span> {game.systemRequirements.recommended.storage}</div>
                  {game.systemRequirements.recommended.additional && (
                    <div><span className="text-gray-400">Additional:</span> {game.systemRequirements.recommended.additional}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Links */}
        <div className="mt-8 pt-6 border-t border-gaming-border">
          <h3 className="text-lg font-semibold text-white mb-4">Download Links</h3>
          <div className="flex flex-wrap gap-3">
            {game.downloadLinks.magnet && (
              <a
                href={game.downloadLinks.magnet}
                className="gaming-button flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={16} />
                Magnet Link
              </a>
            )}
            {game.downloadLinks.torrent && (
              <a
                href={game.downloadLinks.torrent}
                className="gaming-button-secondary flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                Torrent File
              </a>
            )}
            {game.downloadLinks.direct && (
              <a
                href={game.downloadLinks.direct}
                className="gaming-button-secondary flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                Direct Download
              </a>
            )}
          </div>
        </div>

        {/* Notes */}
        {game.notes && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h4 className="text-md font-semibold text-yellow-400 mb-2">Important Notes</h4>
            <p className="text-yellow-200 text-sm">{game.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
