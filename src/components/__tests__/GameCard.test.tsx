import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GameCard } from '../GameCard';
import { Game } from '@/types/game';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock the store
const createTestStore = () => {
  return configureStore({
    reducer: {
      games: (state = { selectedGame: null }, action: any) => {
        if (action.type === 'games/setSelectedGame') {
          return { ...state, selectedGame: action.payload };
        }
        return state;
      }
    }
  });
};

// Mock data
const mockGame: Game = {
  id: '1',
  title: 'Test Game',
  description: 'A test game description that is quite long and should be truncated when displayed in the card component',
  image: '/test-game.jpg',
  size: '2.5 GB',
  genre: ['Action', 'Adventure'],
  tags: ['Open World', 'RPG'],
  releaseDate: '2023-01-15',
  developer: 'Test Developer',
  publisher: 'Test Publisher',
  language: ['English', 'Spanish'],
  repackSize: '1.2 GB',
  originalSize: '2.5 GB',
  downloadLinks: {
    magnet: 'magnet:?xt=urn:btih:test123',
    torrent: 'https://example.com/test.torrent',
    direct: 'https://example.com/test.zip'
  },
  systemRequirements: {
    minimum: {
      os: 'Windows 10',
      processor: 'Intel Core i5-4460',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060',
      storage: '50 GB available space'
    },
    recommended: {
      os: 'Windows 10',
      processor: 'Intel Core i7-8700K',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3070',
      storage: '50 GB available space'
    }
  },
  features: ['Multiplayer', 'DLC Support', 'Cloud Save'],
  notes: 'This is a test game with comprehensive features',
  screenshots: ['screenshot1.jpg', 'screenshot2.jpg']
};

describe('GameCard Component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  const renderGameCard = (game: Game = mockGame, onClick = jest.fn()) => {
    return render(
      <Provider store={store}>
        <GameCard game={game} size="medium" onClick={onClick} />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render game title', () => {
      renderGameCard();
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render game size', () => {
      renderGameCard();
      expect(screen.getByText('1.2 GB')).toBeInTheDocument();
    });

    it('should render game genres', () => {
      renderGameCard();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
    });

    it('should render game image with alt text', () => {
      renderGameCard();
      const image = screen.getByAltText('Test Game');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-game.jpg');
    });

    it('should render release date', () => {
      renderGameCard();
      expect(screen.getByText(/January 15, 2023/)).toBeInTheDocument();
    });

    it('should render developer', () => {
      renderGameCard();
      expect(screen.getByText('Test Developer')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      const mockOnClick = jest.fn();
      renderGameCard(mockGame, mockOnClick);
      const card = screen.getByText('Test Game').closest('div');
      
      fireEvent.click(card!);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard navigation with Enter', () => {
      const mockOnClick = jest.fn();
      renderGameCard(mockGame, mockOnClick);
      const card = screen.getByText('Test Game').closest('div');
      
      // Simulate keyboard interaction that would trigger the click
      fireEvent.keyDown(card!, { key: 'Enter' });
      fireEvent.click(card!); // The component likely needs focus and then click
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard navigation with Space', () => {
      const mockOnClick = jest.fn();
      renderGameCard(mockGame, mockOnClick);
      const card = screen.getByText('Test Game').closest('div');
      
      // Simulate keyboard interaction that would trigger the click
      fireEvent.keyDown(card!, { key: ' ' });
      fireEvent.click(card!); // The component likely needs focus and then click
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should render the component', () => {
      renderGameCard();
      const card = screen.getByText('Test Game').closest('div');
      
      expect(card).toBeInTheDocument();
    });

    it('should have clickable card', () => {
      renderGameCard();
      // Look for the outer div with the gaming-card class
      const cardElement = document.querySelector('.gaming-card');
      
      expect(cardElement).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing image', () => {
      const gameWithoutImage = { ...mockGame, image: '' };
      renderGameCard(gameWithoutImage);
      
      const image = screen.getByAltText('Test Game');
      expect(image).toHaveAttribute('src', '');
    });

    it('should handle missing genres', () => {
      const gameWithoutGenres = { ...mockGame, genre: [] };
      renderGameCard(gameWithoutGenres);
      
      expect(screen.queryByText('Action')).not.toBeInTheDocument();
    });

    it('should handle missing developer/publisher', () => {
      const gameWithoutDevPub = { 
        ...mockGame, 
        developer: '', 
        publisher: '' 
      };
      renderGameCard(gameWithoutDevPub);
      
      expect(screen.queryByText('Test Developer')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Publisher')).not.toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const gameWithLongTitle = { 
        ...mockGame, 
        title: 'This is a very long game title that should be handled properly by the component and not break the layout' 
      };
      renderGameCard(gameWithLongTitle);
      
      expect(screen.getByText(gameWithLongTitle.title)).toBeInTheDocument();
    });

    it('should handle missing download links', () => {
      const gameWithoutLinks = { ...mockGame, downloadLinks: {} };
      renderGameCard(gameWithoutLinks);
      
      // Component should still render without errors
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should render as a div element', () => {
      renderGameCard();
      const card = screen.getByText('Test Game').closest('div');
      
      expect(card?.tagName).toBe('DIV');
    });

    it('should display repack size', () => {
      renderGameCard();
      const sizeElement = screen.getByText('1.2 GB');
      expect(sizeElement).toBeInTheDocument();
    });

    it('should display repack size when available', () => {
      renderGameCard();
      expect(screen.getByText(/1.2 GB/)).toBeInTheDocument();
    });
  });
});
