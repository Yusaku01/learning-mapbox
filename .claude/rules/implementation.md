# Implementation Guidelines

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Development server with HMR
npm run dev

# Type checking and route type generation
npm run typecheck

# Production build
npm run build

# Start production server
npm run start
```

### Development Workflow
```bash
# Start development (typical workflow)
npm install          # Install dependencies
npm run typecheck    # Verify types
npm run dev          # Start dev server on http://localhost:5173
```

### Production Deployment
```bash
# Build and deploy
npm run build        # Create production build
npm run start        # Start production server on port 3000

# Docker deployment
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## Code Organization

### Route Implementation
- All route components go in `app/routes/` directory
- Route configuration managed in `app/routes.ts`
- Use auto-generated `Route` types for type safety
- Implement `meta`, `links`, and data loading functions as needed

### Component Structure
```typescript
// app/routes/example.tsx
import type { Route } from "./+types/example";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Title" },
    { name: "description", content: "Page description" },
  ];
}

export function links(): Route.LinksFunction {
  return [
    { rel: "stylesheet", href: "/custom-styles.css" },
  ];
}

export default function Example() {
  return (
    <div>
      <h1>Example Page</h1>
    </div>
  );
}
```

### Styling Guidelines
- Use TailwindCSS utility classes
- Global styles defined in `app/app.css`
- Follow mobile-first responsive design
- Support dark mode with `dark:` variants
- Custom theme configured in `app.css` with `@theme` directive

### TypeScript Patterns
```typescript
// Use path aliases for clean imports
import { Component } from "~/components/Component";

// Leverage auto-generated route types
import type { Route } from "./+types/route-name";

// Type-safe meta functions
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.title },
    { name: "description", content: data.description },
  ];
}
```

## Development Best Practices

### Error Handling
- Use error boundaries in `root.tsx` for global error handling
- Implement route-level error boundaries when needed
- Provide meaningful error messages for development
- Handle both 404s and server errors appropriately

### Performance Optimization
- Server-side rendering enabled by default
- Use code splitting for large components
- Optimize images and static assets
- Implement proper caching strategies
- Monitor bundle size with build output

### Type Safety
- Run `npm run typecheck` before commits
- Use strict TypeScript configuration
- Leverage auto-generated route types
- Define proper prop interfaces for components

### Development Tips
- HMR preserves state during development
- TypeScript errors appear in both terminal and browser
- Route types regenerate automatically during development
- Use React Developer Tools for debugging SSR applications

## File Conventions

### Route Files
```
app/routes/
├── _index.tsx          # Home route (/)
├── about.tsx          # About route (/about)
├── users.tsx          # Users layout route (/users)
├── users.$id.tsx      # Dynamic user route (/users/:id)
└── users._index.tsx   # Users index route (/users)
```

### Component Organization
```
app/
├── components/        # Reusable components
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── styles/           # Additional stylesheets
└── types/            # Shared TypeScript types
```

## Testing Strategy

Currently no testing framework configured. Recommended additions:

### Unit Testing
```bash
# Add Vitest for unit testing
npm install -D vitest @vitejs/plugin-react

# Add testing utilities
npm install -D @testing-library/react @testing-library/jest-dom
```

### E2E Testing
```bash
# Add Playwright for end-to-end testing
npm install -D @playwright/test

# Add Cypress alternative
npm install -D cypress
```

### Testing Commands (to be implemented)
```bash
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests
npm run test:coverage  # Generate coverage report
```

## Deployment Guidelines

### Environment Variables
- Configure environment-specific variables
- Use `.env` files for local development
- Set production variables in deployment platform

### Docker Deployment
- Multi-stage build optimizes image size
- Production image runs on Node.js Alpine
- Build artifacts located in `build/` directory
- Container exposes port 3000

### Manual Deployment
Required files for deployment:
- `package.json` and lock file
- `build/client/` (static assets)
- `build/server/` (SSR code)
- Node.js runtime environment

### Build Verification
Before deployment:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` completes successfully
- [ ] Production server starts with `npm run start`
- [ ] SSR functionality works correctly
- [ ] Static assets load properly

## Common Tasks

### Adding New Routes
1. Create route file in `app/routes/`
2. Add route to `app/routes.ts` if needed
3. Implement meta, links, and component
4. Test route navigation and SSR

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Verify after updates
npm run typecheck
npm run build
```

### Debugging SSR Issues
- Check for client-only code in server context
- Verify hydration matches server render
- Use browser dev tools for hydration mismatches
- Test with JavaScript disabled for SSR validation