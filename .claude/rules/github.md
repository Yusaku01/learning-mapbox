# Git Workflow & GitHub Guidelines

## Conventional Commits

### Basic Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- `feat`: New features or functionality
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code restructuring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Maintenance tasks, tooling changes

### Scopes (React Router Specific)
- `router`: Route configuration changes
- `ssr`: Server-side rendering related
- `ui`: User interface components
- `styles`: TailwindCSS or styling changes
- `types`: TypeScript type definitions
- `docker`: Docker configuration

### Commit Examples
```bash
feat(router): add user profile route
fix(ssr): resolve hydration mismatch in production
docs: update deployment instructions
style(ui): format welcome component
refactor(types): simplify route type definitions
perf(build): optimize bundle size with code splitting
test(router): add unit tests for route navigation
build(deps): update React Router to v7.7.1
ci: add Docker build to GitHub Actions
chore(dev): update development scripts
```

## Branch Naming Convention

### Format
```
<type>/<description-with-hyphens>
```

### Branch Types
- `feature/`: New features
- `fix/`: Bug fixes
- `hotfix/`: Critical production fixes
- `docs/`: Documentation updates
- `refactor/`: Code refactoring
- `perf/`: Performance improvements
- `test/`: Testing improvements
- `build/`: Build system changes

### Branch Examples
```
feature/user-authentication
feature/mapbox-integration
fix/ssr-hydration-error
hotfix/production-build-failure
docs/deployment-guide
refactor/route-configuration
perf/bundle-optimization
test/add-component-tests
build/docker-optimization
```

## Development Workflow

### 1. Starting New Work
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push -u origin feature/your-feature-name
```

### 2. Code Review Process
```bash
# Create pull request (via GitHub CLI or web interface)
gh pr create --title "feat: add new feature" --body "Description of changes"

# Address review feedback
git add .
git commit -m "fix: address review feedback"
git push
```

### 3. Merging and Cleanup
```bash
# After PR approval and merge
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/your-feature-name
```

## Pre-commit Checklist

Before committing, ensure:
- [ ] `npm run typecheck` passes without errors
- [ ] Application builds successfully with `npm run build`
- [ ] Development server runs without errors (`npm run dev`)
- [ ] No TypeScript errors in IDE
- [ ] Code follows project conventions
- [ ] Commit message follows conventional commits format

## Pull Request Guidelines

### PR Title Format
Use conventional commit format:
```
feat(scope): add new feature description
fix(router): resolve navigation issue
docs: update README with new deployment steps
```

### PR Description Template
```markdown
## Summary
Brief description of changes

## Changes
- [ ] Added new route for user profile
- [ ] Updated TypeScript types
- [ ] Added error boundary handling

## Testing
- [ ] Local development server works
- [ ] Type checking passes
- [ ] Build completes successfully
- [ ] SSR functionality verified

## Deployment Notes
Any special deployment considerations
```

## Repository Maintenance

### Protected Branches
- `main`: Production branch, requires PR reviews
- No direct commits to main branch

### Required Checks
- TypeScript compilation
- Build success
- No merge conflicts

### Release Process
1. Create release branch from main
2. Update version in package.json
3. Test production build
4. Create GitHub release with tag
5. Deploy to production environment