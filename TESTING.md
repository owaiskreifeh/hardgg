# Testing Guide

This document provides information about the testing setup and how to run tests for the FitGirl Repacks Next.js application.

## Test Structure

The application uses a comprehensive testing strategy with both Jest and Mocha:

### Jest Tests (Unit & Component Tests)
- **Location**: `src/**/__tests__/`
- **Purpose**: Unit tests for utilities, Redux slices, and React component tests
- **Framework**: Jest + React Testing Library

### Mocha Tests (Integration Tests)
- **Location**: `test/integration/`
- **Purpose**: Integration tests for complex business logic
- **Framework**: Mocha + Chai

## Test Categories

### 1. Utility Functions (`src/lib/__tests__/utils.test.ts`)
Tests for core utility functions including:
- File size formatting and parsing
- Debounce and throttle functions
- Text manipulation utilities
- URL validation
- Date formatting

### 2. Game Filtering Logic (`src/store/utils/__tests__/gameFilters.test.ts`)
Tests for the core game filtering and sorting functionality:
- Search functionality (title, description, genre, tags)
- Filtering by genre, size, language
- Sorting by title, release date, size
- Edge cases and error handling

### 3. Redux Store (`src/store/slices/__tests__/gamesSlice.test.ts`)
Tests for Redux state management:
- Initial state validation
- Action creators and reducers
- Async thunks (fetchGames, loadMoreGames, fetchGameById)
- Error handling and loading states

### 4. API Endpoints (`src/app/api/__tests__/games.test.ts`)
Tests for API route handlers:
- GET /api/games (with pagination, search, filters)
- GET /api/games/[id] (individual game retrieval)
- Error handling and edge cases

### 5. React Components (`src/components/__tests__/GameCard.test.tsx`)
Tests for React components:
- Component rendering
- User interactions
- Accessibility features
- Edge cases and error states

### 6. Integration Tests (`test/integration/gameSearch.test.js`)
End-to-end testing of complex scenarios:
- Complete search workflows
- Multiple filter combinations
- Complex sorting scenarios
- Real-world usage patterns

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm run test:all
```

### Run Jest Tests Only
```bash
# Run all Jest tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Run Mocha Integration Tests Only
```bash
npm run test:integration
```

### Run Specific Test Files
```bash
# Run specific Jest test file
npm test -- src/lib/__tests__/utils.test.ts

# Run specific Mocha test file
npm run test:integration -- test/integration/gameSearch.test.js
```

## Test Coverage

The testing setup includes coverage reporting with a minimum threshold of 70% for:
- Branches
- Functions
- Lines
- Statements

### Coverage Report
After running `npm run test:coverage`, you can find the coverage report in:
- Console output
- `coverage/lcov-report/index.html` (HTML report)

## Testing Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests using `describe` blocks
- Follow the AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies (API calls, file system)
- Use Jest's built-in mocking capabilities
- Mock React components when necessary

### 3. Test Data
- Use realistic test data that matches production
- Create reusable mock objects
- Test edge cases and error scenarios

### 4. Component Testing
- Test user interactions (clicks, keyboard events)
- Verify accessibility features
- Test component state changes
- Mock Redux store for component tests

### 5. Integration Testing
- Test complete workflows
- Verify data flow between components
- Test error handling across layers

## Debugging Tests

### Jest Debugging
```bash
# Run tests with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test with debugging
npm test -- --verbose --no-coverage
```

### Mocha Debugging
```bash
# Run Mocha with debugging
node --inspect-brk node_modules/.bin/mocha --timeout 10000
```

## Continuous Integration

The test suite is configured for CI/CD with:
- Jest tests run in CI mode (`--ci --coverage --watchAll=false`)
- Coverage thresholds enforced
- All tests must pass before deployment

## Adding New Tests

### For New Utility Functions
1. Create test file in `src/lib/__tests__/`
2. Test all edge cases and error conditions
3. Ensure 100% coverage for critical functions

### For New Components
1. Create test file in `src/components/__tests__/`
2. Test rendering, interactions, and accessibility
3. Mock external dependencies

### For New API Endpoints
1. Create test file in `src/app/api/__tests__/`
2. Test success and error scenarios
3. Mock file system and external services

### For New Redux Logic
1. Create test file in `src/store/slices/__tests__/`
2. Test reducers, actions, and async thunks
3. Verify state changes and side effects

## Common Issues and Solutions

### 1. Module Resolution
If you encounter module resolution issues:
- Ensure `tsconfig.json` paths are correct
- Check Jest module name mapping in `package.json`
- Verify import paths use `@/` alias

### 2. Mock Issues
If mocks aren't working:
- Clear Jest cache: `npm test -- --clearCache`
- Check mock setup in `jest.setup.js`
- Verify mock placement and scope

### 3. Async Test Issues
For async test failures:
- Use `async/await` properly
- Add appropriate timeouts
- Mock timers when testing debounce/throttle

### 4. Component Test Issues
For component test problems:
- Ensure proper Redux store setup
- Mock external dependencies
- Use `screen` queries from React Testing Library

## Performance Testing

For performance-critical functions:
- Use Jest's performance testing features
- Test with large datasets
- Monitor memory usage in tests

## Security Testing

Consider adding security tests for:
- Input validation
- XSS prevention
- SQL injection protection
- Authentication/authorization

## Future Enhancements

Potential improvements to the testing setup:
- E2E tests with Playwright or Cypress
- Visual regression testing
- Performance benchmarking
- Security vulnerability scanning
- Load testing for API endpoints
