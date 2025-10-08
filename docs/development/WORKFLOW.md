# Development Workflow Guide

This guide outlines the development workflow and best practices for contributing to the KobKlein project.

## 🚀 Quick Start

### For New Developers

1. **Clone the repository**

   ```bash
   git clone https://github.com/carleintech/kobklein.git
   cd kobklein
   ```

2. **Run the setup script**

   ```bash
   # Linux/macOS
   ./scripts/setup-dev.sh

   # Windows
   ./scripts/setup-dev.ps1
   ```

3. **Start development**
   ```bash
   cd web
   pnpm dev
   ```

## 🔧 Development Tools

### Package Manager

We use **pnpm** for package management due to its performance benefits and workspace support.

```bash
# Install dependencies
pnpm install

# Add a dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>
```

### Code Quality Tools

#### TypeScript

- **Type checking**: `pnpm type-check`
- **Strict mode enabled** for better type safety
- **Path aliases** configured for cleaner imports

#### ESLint

- **Linting**: `pnpm lint`
- **Auto-fix**: `pnpm lint:fix`
- **Rules**: TypeScript, React, accessibility, and performance rules

#### Prettier

- **Format code**: `pnpm format`
- **Check formatting**: `pnpm format:check`
- **Auto-format on save** (VSCode configured)

## 📝 Commit Workflow

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**

```
feat(auth): add OAuth login functionality
fix(ui): resolve button alignment issue
docs: update API documentation
refactor: simplify user validation logic
```

### Git Hooks

**Pre-commit** (runs automatically):

- Type checking
- ESLint
- Prettier formatting
- Test execution (if applicable)

**Pre-push** (runs automatically):

- Build verification
- Security audit
- Bundle analysis (optional)

**Commit message** (runs automatically):

- Validates commit message format
- Ensures conventional commit standards

### Using Commitizen (Optional)

For easier commit message formatting:

```bash
pnpm commit
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

- **Unit tests**: `*.test.ts`, `*.test.tsx`
- **Integration tests**: `tests/integration/`
- **E2E tests**: `tests/e2e/`

## 🏗️ Build & Deployment

### Development Build

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Build Analysis

```bash
pnpm build:analyze
```

### Build Optimization

```bash
pnpm build:optimize
```

## 🔧 Configuration Validation

### Validate All Configurations

```bash
pnpm config:validate
```

This checks:

- `package.json` structure
- `tsconfig.json` settings
- `next.config.mjs` optimization
- ESLint configuration
- Prettier setup
- Environment variables
- `.gitignore` completeness

## 📁 Project Structure

```
web/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript definitions
│   ├── styles/       # Global styles
│   └── utils/        # Helper utilities
├── public/           # Static assets
├── scripts/          # Development scripts
├── tests/            # Test files
└── docs/             # Documentation
```

## 🎯 Best Practices

### Code Style

- Use **TypeScript** for all new code
- Follow **React best practices** (hooks, functional components)
- Use **Tailwind CSS** for styling
- Implement **proper error boundaries**
- Use **meaningful variable names**

### Performance

- Optimize images (WebP/AVIF)
- Use dynamic imports for code splitting
- Implement proper caching strategies
- Monitor bundle size

### Accessibility

- Use semantic HTML
- Include proper ARIA attributes
- Test with keyboard navigation
- Ensure color contrast compliance

### Security

- Validate all inputs
- Use environment variables for secrets
- Implement proper authentication
- Regular security audits

## 🛠️ VSCode Configuration

The project includes a comprehensive VSCode workspace configuration:

### Recommended Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API testing)

### Workspace Settings

- Format on save enabled
- Auto-import organization
- Proper rulers and word wrap
- Integrated terminal configuration

## 🚨 Troubleshooting

### Common Issues

**Type errors after dependency updates:**

```bash
pnpm type-check
```

**Linting errors:**

```bash
pnpm lint:fix
```

**Build failures:**

```bash
pnpm clean
pnpm install
pnpm build
```

**Git hooks not working:**

```bash
pnpm husky install
```

### Getting Help

1. Check the console for error messages
2. Run `pnpm config:validate` to verify setup
3. Review this workflow guide
4. Check existing issues in the repository
5. Ask questions in team discussions

## 🔄 Workflow Summary

1. **Pull latest changes**: `git pull origin main`
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** following code standards
4. **Test locally**: `pnpm dev:validate`
5. **Commit changes**: `git commit -m "feat: your feature"`
6. **Push to remote**: `git push origin feature/your-feature`
7. **Create pull request** with proper description
8. **Address review feedback** if needed
9. **Merge after approval**

---

Happy coding! 🚀
