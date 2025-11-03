# KobKlein Development Tasks

## ✅ Completed: Workspace Configuration Fix

- [x] Updated `kobklein.code-workspace` with multi-root workspace
- [x] Added concurrent task execution for frontend + backend
- [x] Created compound debug configurations
- [x] Fixed package.json scripts for proper service startup
- [x] Added helper scripts (start-dev.ps1, start-dev.sh)
- [x] Created comprehensive WORKSPACE_SETUP.md guide
- [x] Configured ESLint for both web and backend/api
- [x] Set up proper terminal working directories

## 🚀 How to Run Both Services

### Quick Start:
```bash
# Windows
.\start-dev.ps1

# Mac/Linux
./start-dev.sh

# Or using pnpm
pnpm dev:all
```

### VSCode Tasks:
- Press `Ctrl+Shift+P` → "Tasks: Run Task" → "🚀 Start All (Frontend + Backend)"

---

## Frontend Final Touches

### Enhancements to Implement

1. Enhance Microinteractions & Animations
   - [ ] Add subtle hover and click animations to buttons and interactive elements
   - [ ] Implement scroll-triggered animations for content sections
   - [ ] Add floating elements and particle effects for a more dynamic feel

2. Improve Data Visualization
   - [ ] Enhance the feature rail component with more modern chart visualizations
   - [ ] Add animated statistics and numbers to highlight key metrics

3. Implement Dark Mode Enhancements
   - [ ] Refine the dark mode aesthetic with better contrast and glow effects
   - [ ] Add subtle texture overlays for depth

4. Add Mobile-First Optimizations
   - [ ] Ensure all components are fully responsive with mobile-specific enhancements
   - [ ] Add touch-specific interactions for mobile users

5. Enhance Personalization Elements
   - [ ] Add personalized content sections that adapt based on user type
   - [ ] Implement smart content that changes based on interaction patterns

6. Create New UI Illustrations
   - [ ] Design modern, cohesive illustrations for product features
   - [ ] Add animated illustrations to demonstrate product functionality

7. Implement Color Refinements
   - [ ] Introduce the guava color (orange-pink mix) as an accent to make the site stand out
   - [ ] Create a more balanced color palette that maintains brand identity while being distinctive

## Files to Edit

- `web/src/components/welcome/welcome-hero.tsx` - Enhance hero section with more modern animations
- `web/src/components/welcome/welcome-feature-rail.tsx` - Improve data visualization
- `web/src/components/welcome/welcome-features.tsx` - Add microinteractions
- `web/src/app/globals.css` - Add new color variables and animation classes
- `web/src/components/welcome/welcome-card-showcase.tsx` - Enhance card animations
- `web/src/components/welcome/welcome-download.tsx` - Improve mobile app promotion
