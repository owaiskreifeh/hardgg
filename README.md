# FitGirl Repacks - Next.js Gaming Hub

A modern, responsive gaming hub built with Next.js 15.x, TypeScript, and Tailwind CSS. This application provides a beautiful interface for browsing and searching through a collection of repacked games with advanced filtering and search capabilities.

## 🚀 Features

- **Modern UI/UX**: Beautiful gaming-themed design with smooth animations
- **Advanced Search**: Fuzzy search with Fuse.js for accurate results
- **Smart Filtering**: Filter by genre, size, language, developer, and more
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Mobile-First**: Sticky search bar, floating action button, and mobile menu
- **Grid Views**: Multiple grid sizes (small, medium, large) for different viewing preferences
- **Game Details**: Comprehensive game information with metadata
- **Performance Optimized**: Built with Next.js 15.x and Turbopack for optimal performance
- **TypeScript**: Full type safety throughout the application
- **State Management**: Redux Toolkit with RTK Query for efficient state management
- **API Routes**: RESTful API endpoints for games, search, and statistics
- **Redis Integration**: Fast in-memory data storage and caching
- **Infinite Scroll**: Smooth pagination with infinite scroll loading
- **Debug Panel**: Development tools for testing and debugging
- **Loading States**: Optimized loading indicators and skeleton screens

## 🛠️ Tech Stack

- **Framework**: Next.js 15.x with App Router
- **Bundler**: Turbopack (Rust-based, ultra-fast development)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **State Management**: Redux Toolkit with RTK Query
- **Search**: Fuse.js for fuzzy search
- **Database**: Redis for data storage and caching
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Orbitron)
- **Code Quality**: ESLint with custom clean code rules
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hardgg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Redis (for development)**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or install Redis locally
   # Follow Redis installation guide for your OS
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── games/         # Games API endpoints
│   │   │   ├── [id]/      # Individual game endpoint
│   │   │   ├── stats/     # Game statistics endpoint
│   │   │   └── route.ts   # Games list endpoint
│   │   └── health/        # Health check endpoint
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── SearchBar.tsx      # Search functionality
│   ├── StickySearchBar.tsx # Mobile sticky search
│   ├── GameGrid.tsx       # Game grid display
│   ├── GameCard.tsx       # Individual game card
│   ├── FilterPanel.tsx    # Filtering and sorting
│   ├── GameModal.tsx      # Game details modal
│   ├── MobileMenu.tsx     # Mobile menu dialog
│   ├── FloatingActionButton.tsx # Mobile FAB
│   ├── LoadingSpinner.tsx # Loading states
│   ├── InfiniteScroll.tsx # Infinite scroll component
│   └── DebugPanel.tsx     # Development debug panel
├── store/                 # Redux Toolkit store
│   ├── index.ts           # Store configuration
│   ├── Provider.tsx       # Redux provider
│   ├── slices/            # Redux slices
│   │   ├── gamesSlice.ts  # Games state management
│   │   ├── searchSlice.ts # Search state management
│   │   └── uiSlice.ts     # UI state management
│   ├── hooks/             # Custom Redux hooks
│   └── selectors.ts       # State selectors
├── lib/                   # Utilities and services
│   ├── redis.ts           # Redis operations
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
    └── game.ts            # Game-related types
```

## 🎮 Usage

### Searching Games
- Use the search bar to find games by title, description, genre, or developer
- Search suggestions appear as you type
- Fuzzy search provides accurate results even with typos
- Mobile users can use the sticky search bar at the top

### Filtering Games
- **Genre**: Filter by game genres (Action, RPG, Strategy, etc.)
- **Size**: Filter by maximum file size
- **Language**: Filter by supported languages
- **Developer/Publisher**: Filter by specific companies

### Sorting Options
- **Title**: Alphabetical sorting
- **Release Date**: Chronological sorting
- **Size**: File size sorting
- **Popularity**: Popularity-based sorting

### Grid Views
- **Small**: Compact view with minimal information
- **Medium**: Balanced view with moderate detail
- **Large**: Detailed view with full information

### Mobile Features
- **Sticky Search Bar**: Always accessible search at the top
- **Floating Action Button**: Quick access to filters and menu
- **Mobile Menu**: Slide-in menu with search and filter options
- **Touch-Friendly**: Optimized for touch interactions

### Game Details
Click on any game card to view:
- Full game description
- Game metadata (companies, languages, sizes)
- Game features and tags
- Release information

### Development Features
- **Debug Panel**: Development tools for testing search and filters
- **Infinite Scroll**: Smooth pagination for large datasets
- **Loading States**: Optimized loading indicators

## 🔌 API Endpoints

### Games API
- `GET /api/games` - Get all games with pagination and filtering
- `GET /api/games/[id]` - Get specific game by ID
- `GET /api/games/stats` - Get game statistics

### Health Check
- `GET /api/health` - Application health status

### Query Parameters
- `q` - Search query
- `genre` - Filter by genre (comma-separated)
- `size` - Filter by size
- `language` - Filter by language (comma-separated)
- `sortBy` - Sort field (title, releaseDate, size)
- `sortOrder` - Sort order (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page

## 🎨 Customization

### Colors and Theme
The application uses a custom gaming theme defined in `tailwind.config.js`. You can customize:

- **Primary Colors**: Gaming blue (#00D4FF)
- **Secondary Colors**: Purple accent (#7C3AED)
- **Background**: Dark gaming gradient
- **Cards**: Dark theme with subtle borders

### Adding New Games
Games are stored in Redis. You can add new games through the API or by modifying the data loading scripts:

```typescript
const newGame: Game = {
  id: 'unique-id',
  title: 'Game Title',
  description: 'Game description...',
  image: 'image-url',
  size: '50 GB',
  genre: ['Action', 'Adventure'],
  // ... other properties
};
```

### Styling Components
All components use Tailwind CSS classes with custom gaming utilities. You can modify styles in:

- `src/app/globals.css` - Global styles and utilities
- `tailwind.config.js` - Theme configuration
- Individual component files - Component-specific styles

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically

### Docker Deployment
```bash
# Build the production image
docker build -t fitgirl-repacks .

# Run with Docker Compose
docker-compose -f docker/docker-compose.yml up -d
```

### Other Platforms
The application can be deployed to any platform that supports Next.js:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔧 Development

### Docker Development with Turbopack

For the best development experience with hot reloading, use Docker:

#### Quick Start (Windows PowerShell)
```powershell
# Run the development script
.\scripts\dev.ps1
```

#### Quick Start (Linux/macOS)
```bash
# Make the script executable
chmod +x scripts/dev.sh

# Run the development script
./scripts/dev.sh
```

#### Manual Docker Setup
```bash
# Start the development environment
docker-compose -f docker/docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker/docker-compose.dev.yml up -d --build
```

#### Development Features
- **🚀 Turbopack**: Ultra-fast bundling and hot reloading
- **🔄 Hot Reloading**: Instant code changes without page refresh
- **📦 Redis**: In-memory data storage for development
- **🎯 TypeScript**: Full type safety and IntelliSense
- **🎨 Tailwind**: Hot reloading for CSS changes
- **🔍 ESLint**: Code quality and clean code enforcement
- **🐛 Debug Panel**: Development tools for testing

### Local Development

#### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Clean build artifacts
- `npm run dev:docker` - Start development with Docker

### Code Quality Standards

This project follows clean code principles with comprehensive ESLint rules:

- **Clean Code Guidelines**: Meaningful names, single responsibility, DRY principle
- **TypeScript Best Practices**: Full type safety and modern TypeScript features
- **React Best Practices**: Functional components, hooks, proper state management
- **Performance Optimization**: Efficient rendering, proper memoization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Detailed development setup and guidelines
- [Mobile Features](docs/MOBILE_FEATURES.md) - Mobile-specific features and implementation
- [Docker Guide](docs/README-DOCKER.md) - Docker setup and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the code quality standards and ESLint rules
4. Make your changes
5. Add tests if applicable
6. Submit a pull request

### Development Guidelines
- Follow the established component structure (1 component per file)
- Use TypeScript for all new code
- Implement proper error handling
- Write clean, readable code following clean code principles
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FitGirl Repacks** - For the concept and inspiration
- **Next.js Team** - For the amazing framework
- **Redux Toolkit Team** - For excellent state management
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Note**: This is a demo application. In a production environment, you would integrate with real APIs and implement proper authentication and security measures.
