# 📦 Migration to pnpm Guide

## 🚀 Quick Migration Steps

### 1. Install pnpm (if not already installed)

```bash
# Via npm (easiest)
npm install -g pnpm

# Via PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Via Homebrew (macOS)
brew install pnpm

# Via Scoop (Windows)
scoop install pnpm
```

### 2. Remove old lockfiles and node_modules

```bash
# From project root
rm -rf node_modules package-lock.json yarn.lock
rm -rf web/node_modules web/package-lock.json web/yarn.lock

# Or use our clean script
pnpm run clean:hard
```

### 3. Install dependencies with pnpm

```bash
# From project root
pnpm install
```

## 🎯 Key Benefits You'll Get

✅ **50-90% faster installs** compared to npm
✅ **Saves gigabytes** of disk space with global store
✅ **Stricter dependency resolution** prevents phantom dependencies
✅ **Better monorepo support** with workspace filtering
✅ **Identical package.json** - no migration headaches

## 📋 New Commands Available

### Workspace Commands (from root)

```bash
pnpm dev              # Start web app
pnpm dev:all          # Start all apps in parallel
pnpm build:all        # Build all packages
pnpm test             # Run tests in all packages
pnpm lint             # Lint all packages
pnpm deps:update      # Update all dependencies
```

### Package-Specific Commands

```bash
pnpm --filter web dev        # Start only web app
pnpm --filter web build      # Build only web app
pnpm --filter mobile test    # Test only mobile app
```

### Maintenance Commands

```bash
pnpm store prune      # Clean unused packages from global store
pnpm audit            # Security audit
pnpm outdated         # Check for updates
```

## 🔄 Script Replacements

| Old npm command | New pnpm command |
| --------------- | ---------------- |
| `npm install`   | `pnpm install`   |
| `npm run dev`   | `pnpm dev`       |
| `npm run build` | `pnpm build`     |
| `npm test`      | `pnpm test`      |
| `npm run lint`  | `pnpm lint`      |

## 🛠️ IDE Setup

### VS Code

1. Install "pnpm" extension for better IntelliSense
2. Update terminal default to use pnpm:
   ```json
   {
     "npm.packageManager": "pnpm"
   }
   ```

### WebStorm/IntelliJ

1. Go to Settings → Languages & Frameworks → Node.js and npm
2. Set Package manager to "pnpm"

## 🔧 Troubleshooting

### Permission Issues (Windows)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Cache Issues

```bash
pnpm store prune
rm -rf ~/.pnpm-store
pnpm install
```

### Phantom Dependencies

If you see "Module not found" errors, add missing dependencies:

```bash
pnpm add <missing-package>
```

## 📚 Learn More

- [pnpm Documentation](https://pnpm.io/)
- [Workspace Guide](https://pnpm.io/workspaces)
- [CLI Commands](https://pnpm.io/cli/add)

---

**Ready to switch?** Just run `pnpm install` and you're good to go! 🚀
