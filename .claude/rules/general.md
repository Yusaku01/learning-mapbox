# Project Overview

This is a modern React Router v7 application template with TypeScript, TailwindCSS, and server-side rendering capabilities. The project is production-ready with Docker support and optimized build processes.

## Project Purpose

A full-stack React application template that provides:
- Server-side rendering for better SEO and initial load performance
- Type-safe routing with auto-generated types
- Modern development experience with HMR
- Production-ready deployment with Docker
- Responsive design with TailwindCSS v4

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

## Key Architecture Decisions

1. **React Router v7**: Latest routing solution with built-in SSR support
2. **Vite**: Fast build tool with excellent DX and HMR
3. **TypeScript**: Full type safety with strict mode
4. **TailwindCSS v4**: Utility-first CSS with new theme system
5. **File-based Routing**: Explicit route configuration in `routes.ts`
6. **Error Boundaries**: Comprehensive error handling at root level

## Core Components

### Root Layout (`app/root.tsx`)
- Provides HTML document structure
- Implements error boundaries
- Manages meta tags and links
- Handles client-side hydration

### Route Configuration (`app/routes.ts`)
- Defines application routing structure
- Uses React Router's config-based routing
- Supports nested routes and layouts

### Welcome Component (`app/welcome/`)
- Default landing page template
- Responsive design with dark mode support
- Includes React Router branding assets

## Key Features

- **Server-Side Rendering**: Enabled by default for better SEO and performance
- **Hot Module Replacement**: Fast development experience with instant updates
- **Type Safety**: Full TypeScript support with auto-generated route types
- **Error Boundaries**: Comprehensive error handling with development stack traces
- **Asset Optimization**: Automatic bundling and optimization via Vite
- **Path Aliases**: Clean imports using `~/` prefix for app directory
- **Dark Mode Support**: CSS configured for light/dark theme preferences