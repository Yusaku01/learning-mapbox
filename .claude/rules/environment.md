# Environment Configuration

## Technical Stack

- **Runtime**: Node.js 20+ (Alpine Linux in Docker)
- **Framework**: React Router v7 with SSR
- **Build Tool**: Vite 6.3+ with React Router dev plugin
- **Language**: TypeScript 5.8+ (strict mode)
- **Styling**: TailwindCSS v4
- **Package Manager**: npm (with lock file)

## Dependencies

### Core Dependencies
- `react`: ^19.1.0
- `react-dom`: ^19.1.0
- `react-router`: ^7.7.0
- `@react-router/node`: ^7.7.0
- `@react-router/serve`: ^7.7.0
- `isbot`: ^5.1.27

### Development Dependencies
- `@react-router/dev`: ^7.7.0
- `@tailwindcss/vite`: ^4.1.4
- `@types/node`: ^20
- `@types/react`: ^19.1.2
- `@types/react-dom`: ^19.1.2
- `tailwindcss`: ^4.1.4
- `typescript`: ^5.8.3
- `vite`: ^6.3.3
- `vite-tsconfig-paths`: ^5.1.4

## Environment Setup

### Local Development
- Development server runs on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- TypeScript path aliases configured (`~/*` → `./app/*`)
- ES modules enabled (`"type": "module"`)

### TypeScript Configuration
- Strict mode enabled
- Target: ES2022
- Module: ES2022
- Module Resolution: bundler
- JSX: react-jsx
- Path mapping for clean imports

### Vite Configuration
- React Router plugin for SSR support
- TailwindCSS plugin for styling
- tsconfig paths plugin for TypeScript aliases

### React Router Configuration
- Server-side rendering enabled by default
- File-based routing with explicit configuration
- Auto-generated route types

## Docker Environment

Multi-stage build process:
1. Development dependencies stage
2. Production dependencies stage  
3. Build stage
4. Runtime stage with Node.js Alpine

Production container:
- Exposes port 3000
- Runs with minimal dependencies
- Optimized image size