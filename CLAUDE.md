# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern React Router v7 application template with TypeScript, TailwindCSS, and server-side rendering capabilities. The project is production-ready with Docker support and optimized build processes.

## Key Architecture

- **Framework**: React Router v7 with SSR enabled by default
- **Build Tool**: Vite with React Router dev plugin
- **Styling**: TailwindCSS v4 with custom theme configuration
- **TypeScript**: Strict mode enabled with path aliases (`~/*` → `./app/*`)
- **Entry Point**: `app/root.tsx` provides the HTML shell and error boundary
- **Routing**: File-based routing configured in `app/routes.ts`
- **State Management**: Route-based data loading and mutations
- **Deployment**: Docker-ready with multi-stage build optimization

## Project Structure

```
learning-mapbox/
├── app/                   # Application source code
│   ├── root.tsx          # Root layout component with error boundary
│   ├── routes.ts         # Route configuration
│   ├── app.css           # Global styles with TailwindCSS
│   ├── routes/           # Route components
│   │   └── home.tsx      # Home page route
│   ├── welcome/          # Welcome page assets
│   │   ├── welcome.tsx   # Welcome component
│   │   ├── logo-light.svg
│   │   └── logo-dark.svg
│   └── +types/           # Auto-generated TypeScript types
├── public/               # Static assets
├── build/                # Production build output
│   ├── client/           # Client-side bundles and assets
│   └── server/           # Server-side rendering code
├── .react-router/        # React Router cache and types
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── react-router.config.ts # React Router configuration
├── Dockerfile            # Docker deployment configuration
└── README.md             # Project documentation
```

## Development Commands

```bash
# Install dependencies
npm install

# Development server with HMR on http://localhost:5173
npm run dev

# Type checking and route type generation
npm run typecheck

# Production build
npm run build

# Start production server on port 3000
npm run start
```

## Key Features

- **Server-Side Rendering**: Enabled by default for better SEO and performance
- **Hot Module Replacement**: Fast development experience with instant updates
- **Type Safety**: Full TypeScript support with auto-generated route types
- **Error Boundaries**: Comprehensive error handling with development stack traces
- **Asset Optimization**: Automatic bundling and optimization via Vite
- **Path Aliases**: Clean imports using `~/` prefix for app directory
- **Dark Mode Support**: CSS configured for light/dark theme preferences

## Development Guidelines

- All route components go in `app/routes/` directory
- Use the `Route` type from auto-generated types for type-safe route handling
- Global styles are defined in `app/app.css` using TailwindCSS
- The root layout in `app/root.tsx` handles meta tags, links, and error boundaries
- Route configuration is managed in `app/routes.ts` using React Router's route config

## Testing & Quality

Currently, the project does not include testing frameworks. Consider adding:
- Vitest for unit testing
- Playwright or Cypress for E2E testing
- ESLint and Prettier for code quality

## Deployment

### Docker Deployment

The project includes a multi-stage Dockerfile optimized for production:

```bash
# Build the Docker image
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

### Manual Deployment

Deploy the following files/directories after running `npm run build`:
- `package.json` and lock file
- `build/` directory (contains both client and server code)
- Node.js runtime environment

## Important Notes

- The application uses ES modules (`"type": "module"` in package.json)
- React Router v7 uses file-based routing with explicit route configuration
- TailwindCSS v4 is configured with the new `@theme` directive
- TypeScript is configured in strict mode for better type safety
- The project uses Vite's tsconfig paths plugin for path resolution