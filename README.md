# FitGirl Repacks - Next.js Gaming Hub

A modern, responsive gaming hub built with Next.js 15.x, TypeScript, and Tailwind CSS. This application provides a beautiful interface for browsing and searching through a collection of repacked games with advanced filtering and search capabilities.

## 🚀 Features

- **Modern UI/UX**: Beautiful gaming-themed design with smooth animations
- **Advanced Search**: Fuzzy search with Fuse.js for accurate results
- **Smart Filtering**: Filter by genre, size, language, developer, and more
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Grid Views**: Multiple grid sizes (small, medium, large) for different viewing preferences
- **Game Details**: Comprehensive game information with system requirements
- **Download Links**: Support for magnet links, torrent files, and direct downloads
- **Performance Optimized**: Built with Next.js 15.x for optimal performance
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient state management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.x with App Router
- **Bundler**: Turbopack (Rust-based, ultra-fast development)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **State Management**: Zustand
- **Search**: Fuse.js for fuzzy search
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Orbitron)
- **Database**: Redis (for development data storage)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitgirl-repacks-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── SearchBar.tsx      # Search functionality
│   ├── GameGrid.tsx       # Game grid display
│   ├── GameCard.tsx       # Individual game card
│   ├── FilterPanel.tsx    # Filtering and sorting
│   ├── GameModal.tsx      # Game details modal
│   └── LoadingSpinner.tsx # Loading states
├── lib/                   # Utilities and store
│   ├── store.ts           # Zustand state management
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
    └── game.ts            # Game-related types
```

## 🎮 Usage

### Searching Games
- Use the search bar to find games by title, description, genre, or developer
- Search suggestions appear as you type
- Fuzzy search provides accurate results even with typos

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

### Game Details
Click on any game card to view:
- Full game description
- System requirements (minimum and recommended)
- Download links (magnet, torrent, direct)
- Game features and tags
- Release information

## 🎨 Customization

### Colors and Theme
The application uses a custom gaming theme defined in `tailwind.config.js`. You can customize:

- **Primary Colors**: Gaming blue (#00D4FF)
- **Secondary Colors**: Purple accent (#7C3AED)
- **Background**: Dark gaming gradient
- **Cards**: Dark theme with subtle borders

### Adding New Games
To add new games, modify the `mockGames` array in `src/lib/store.ts` or integrate with a real API:

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
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📱 PWA Features

The application includes PWA features:
- Web app manifest
- Service worker support
- Responsive design
- Offline capabilities (can be enhanced)

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
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

#### Development Features
- **🚀 Turbopack**: Ultra-fast bundling and hot reloading
- **🔄 Hot Reloading**: Instant code changes without page refresh
- **📦 Redis**: In-memory data storage for development
- **🎯 TypeScript**: Full type safety and IntelliSense
- **🎨 Tailwind**: Hot reloading for CSS changes

### Local Development

#### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, readable code
- Follow the established component structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FitGirl Repacks** - For the concept and inspiration
- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Note**: This is a demo application. In a production environment, you would integrate with real APIs and implement proper authentication and security measures.
