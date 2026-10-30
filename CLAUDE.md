# Casey's Portfolio - Development Guidelines

## 🚨 Top Priority Rules

### 1. ALWAYS Use `bun`
Never use `npm` or `yarn`. Always use `bun` for all package management and scripts.

```bash
bun install          # Install dependencies
bun run develop      # Start dev server
bun run build        # Production build (ONLY when needed!)
```

### 2. NEVER Run Build If Dev Server Is Running
**Check first:**

```bash
bun run dev:status   # Check if dev server is running
```

**If dev server is running:**
- Read logs instead: `bun run dev:logs` or `bun run dev:errors`
- ONLY run `bun run build` when explicitly requested

**If dev server is NOT running:**
- You may run `bun run build` to verify changes

### 3. Reading Dev Server Logs
After making code changes, check the dev server logs instead of building:

```bash
bun run dev:logs     # Show last 100 lines of dev output
bun run dev:errors   # Show only errors from dev output
```

## Dev Server Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server WITH file logging (default) |
| `bun run dev:no-logs` | Start dev server WITHOUT file logging |
| `bun run dev:status` | Check if dev server is running |
| `bun run dev:logs` | View recent dev server logs |
| `bun run dev:errors` | View only errors from logs |

**Note:** `bun run dev` now logs to `/tmp/astro-dev.log` by default. Use `bun run dev:no-logs` if you don't want logging.

## Git Worktrees

**For experimental work or parallel branches, use worktrees in `./worktrees/`:**

```bash
# Create a new worktree
git worktree add ./worktrees/branch-name source -b branch-name

# List all worktrees
git worktree list

# Remove a worktree when done
git worktree remove ./worktrees/branch-name
```

**Worktree location:** All worktrees must be created in the `./worktrees/` subdirectory within the project.

## Project Quick Reference

### Tech Stack
- **Framework:** Astro + React islands/pages
- **Styling:** styled-components + reactstrap (grid)
- **Animations:** motion/react (Framer Motion)
- **Icons:** react-icons (lazy-loaded for SSR)
- **Content:** Astro content collections + MDX

### File Locations
```
src/
├── animations/       # Animation configs & hooks
├── components/       # React components
│   ├── style.ts      # Global styles & theme
│   └── **/style.ts   # Component-specific styles
├── data/             # Project data JSON files
├── hooks/            # Custom React hooks
├── layouts/          # Astro layouts
├── pages/            # Astro route files
└── content.config.ts # Astro content collections
```

### Common Patterns

**Scroll to a section:**
```javascript
const element = document.getElementById('Experience');
if (element) {
  window.scrollTo({
    top: element.getBoundingClientRect().top + window.pageYOffset - 80,
    behavior: 'smooth',
  });
}
```

**Lazy-load icons (SSR-safe):**
```javascript
const Icon = lazy(() =>
  import('react-icons/si').then(m => ({ default: m.SiTypescript }))
);
```

**Scroll-triggered animation:**
```javascript
const { ref, isInView } = useInViewAnimation({ once: true });
// Use with motion.div
```

## Git Safety Rules

**ALWAYS ASK before:**
- `git commit`, `git push`, `git checkout`
- `rm -rf`, `git reset --hard`, `git clean`

**Safe without asking:**
- `git status`, `git log`, `git diff`
