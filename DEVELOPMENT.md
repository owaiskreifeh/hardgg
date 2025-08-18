# Development Guide

## Overview

This project is a Next.js application with TypeScript, Redux Toolkit, and Tailwind CSS. It follows clean code principles and modern development practices.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Database**: Redis
- **Code Quality**: ESLint with custom rules
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Redis server (for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hardgg

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev

# Start with Docker
docker-compose -f docker-compose.dev.yml up
```

## Code Quality & Standards

### ESLint Configuration

This project uses a comprehensive ESLint setup with custom rules based on clean code principles:

#### Key Rules Implemented

**Clean Code Guidelines:**
- `prefer-const`: Enforce const over let when variables aren't reassigned
- `no-var`: Disallow var declarations
- `no-magic-numbers`: Warn about hardcoded numbers (except -1, 0, 1, 2)

**Meaningful Names:**
- `id-length`: Ensure variable names are at least 2 characters (with exceptions for common short names)
- `camelcase`: Enforce camelCase naming convention

**Single Responsibility:**
- `max-lines-per-function`: Limit functions to 50 lines
- `max-params`: Limit function parameters to 4
- `complexity`: Limit cyclomatic complexity to 10

**DRY Principle:**
- `no-duplicate-imports`: Prevent duplicate import statements
- `no-useless-return`: Remove unnecessary return statements

**Clean Structure:**
- `no-multiple-empty-lines`: Limit consecutive empty lines
- `no-trailing-spaces`: Remove trailing whitespace
- `eol-last`: Ensure files end with newline
- `comma-dangle`: No trailing commas
- `semi`: Require semicolons
- `quotes`: Use single quotes

**React Specific:**
- `react-hooks/exhaustive-deps`: Ensure all dependencies are included in useEffect
- `react/no-unescaped-entities`: Properly escape HTML entities

**Code Quality:**
- `prefer-template`: Use template literals over string concatenation
- `object-shorthand`: Use shorthand object properties
- `prefer-destructuring`: Use destructuring assignments
- `no-console`: Warn about console statements (allow warn/error)
- `no-debugger`: Disallow debugger statements
- `no-alert`: Warn about alert statements

#### Available Scripts

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues where possible
npm run lint:fix

# Type checking
npm run type-check

# Build the project
npm run build
```

#### ESLint Configuration File

The ESLint configuration is located in `.eslintrc.json` and extends:
- `next`: Next.js recommended rules
- `next/core-web-vitals`: Core Web Vitals rules
- Custom rules for clean code principles

### Code Style Guidelines

#### Component Structure

```typescript
// ✅ Good: Single responsibility, clear naming
export function GameCard({ game, size, onClick }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className={getCardClasses()} onClick={onClick}>
      {/* Component content */}
    </div>
  );
}

// ❌ Bad: Too many responsibilities, unclear naming
export function Component({ data, cb, cls }: Props) {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);
  // ... 100+ lines of mixed logic
}
```

#### Constants and Magic Numbers

```typescript
// ✅ Good: Named constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;

// ❌ Bad: Magic numbers
setTimeout(() => {
  // Do something
}, 300000); // What is this number?
```

#### Function Length and Complexity

```typescript
// ✅ Good: Small, focused functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatUserData = (user: User): FormattedUser => {
  return {
    name: user.firstName + ' ' + user.lastName,
    email: user.email.toLowerCase(),
    age: calculateAge(user.birthDate)
  };
};

// ❌ Bad: Long, complex function
const processUserData = (user: User) => {
  // 50+ lines of mixed validation, formatting, and business logic
  if (user.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new Error('Invalid email');
    }
  }
  // ... more validation
  // ... formatting logic
  // ... business rules
  // ... API calls
};
```

### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── features/       # Feature-specific components
├── lib/                # Utility functions and configurations
├── store/              # Redux store and slices
│   ├── slices/         # Redux Toolkit slices
│   ├── hooks/          # Custom Redux hooks
│   └── utils/          # Store utilities
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS modules
```

### Component Guidelines

- **One component per file**: Each component should be in its own file
- **Standalone components**: Components should be as independent as possible
- **Clear naming**: Use descriptive names that reveal intent
- **Props interface**: Always define TypeScript interfaces for props
- **Default exports**: Use named exports for components

```typescript
// ✅ Good: Clear, standalone component
interface GameCardProps {
  game: Game;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  className?: string;
}

export function GameCard({ game, size, onClick, className }: GameCardProps) {
  // Component implementation
}
```

## State Management

### Redux Toolkit Best Practices

- Use RTK Query for API calls
- Keep slices focused and small
- Use TypeScript for all state definitions
- Implement proper error handling
- Use selectors for derived state

### Custom Hooks

- Create custom hooks for complex logic
- Use `useCallback` and `useMemo` appropriately
- Follow React hooks rules strictly
- Provide clear interfaces for hook consumers

## Testing

### Unit Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

- Test component behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Test error scenarios
- Maintain good test coverage

## Performance

### Optimization Techniques

- Use React.memo for expensive components
- Implement proper memoization
- Optimize bundle size with dynamic imports
- Use Next.js Image component for images
- Implement proper loading states

### Monitoring

- Monitor Core Web Vitals
- Track bundle size
- Monitor API response times
- Use performance profiling tools

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t hardgg .

# Run with Docker Compose
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **ESLint errors**: Run `npm run lint:fix` to auto-fix issues
2. **Type errors**: Check TypeScript configuration and type definitions
3. **Build failures**: Ensure all dependencies are installed and environment variables are set
4. **Performance issues**: Use React DevTools and performance profiling

### Getting Help

- Check the ESLint output for specific rule violations
- Review the clean code guidelines in this document
- Use TypeScript strict mode for better type safety
- Follow the established patterns in the codebase

## Contributing

1. Follow the established code style and patterns
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure ESLint passes before submitting PRs

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Clean Code Principles](https://en.wikipedia.org/wiki/Clean_Code)
