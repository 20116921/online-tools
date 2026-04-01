# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack developer toolbox application built with **Express + Vite + TypeScript + Tailwind CSS**. It provides utilities like hidden character detection, JSON formatting, and timestamp conversion. The application runs as a single-process architecture where both frontend and backend execute in the same process.

## Key Commands

### Development
- `pnpm dev` - Start development server (Vite HMR + Express API on port 5000)
- `pnpm ts-check` - Run TypeScript type checking
- `pnpm lint` - Run ESLint checks

### Building & Deployment
- `pnpm build` - Build both frontend and backend
  - Frontend: Vite builds to `dist/`
  - Backend: tsup bundles to `dist-server/index.js`
- `pnpm start` - Start production server (after building)

### Dependencies
- `pnpm install` - Install all dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add dev dependency
- **IMPORTANT**: Only use `pnpm`, never npm or yarn (enforced by `preinstall` script)

## Project Structure

```
├── scripts/
│   ├── dev.sh          # Starts Express + Vite dev server
│   ├── build.sh        # Builds frontend (Vite) and backend (tsup)
│   ├── start.sh        # Starts production server
│   └── prepare.sh      # Preparation script
├── server/
│   ├── server.ts       # Express application entry point
│   ├── routes/
│   │   └── index.ts    # API route definitions
│   └── vite.ts         # Vite middleware integration
├── src/
│   ├── index.ts        # Frontend app entry point
│   ├── main.ts         # Main application logic (UI & tool implementations)
│   └── index.css       # Global styles with Tailwind directives
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── index.html          # HTML entry point
```

## Architecture & Key Patterns

### Single-Process Architecture
- **Development**: `pnpm dev` runs `tsx watch server/server.ts` which starts Express with Vite middleware
- **Production**: After `pnpm build`, Express serves static files from `dist/` and API routes
- Both frontend and backend run on the same port (5000 by default)
- API routes use `/api` prefix to avoid conflicts with frontend routes

### Frontend Architecture
- **Entry point**: `src/index.ts` imports styles and initializes the app via `initApp()`
- **Main logic**: `src/main.ts` contains all UI rendering and tool implementations
- **Single-page app with tool switching**: The app uses a tabbed navigation system to switch between tools (hidden-char, json-format, timestamp)
- **Tool pattern**: Each tool has three functions:
  1. `render[Tool]()` - Returns HTML string
  2. `init[Tool]Events()` - Sets up event listeners
  3. Tool state managed in `currentTool` variable

### Backend Architecture
- **Express server** (`server/server.ts`):
  - Mounts API router
  - Adds middleware (JSON/urlencoded body parsing)
  - Integrates Vite (dev mode) or static file serving (prod mode)
  - Includes request logging in dev mode and error handling
- **Routes** (`server/routes/index.ts`):
  - All routes prefixed with `/api`
  - Simple examples: `/api/hello`, `/api/data`, `/api/health`
  - Use standard Express patterns for GET/POST requests
- **Vite integration** (`server/vite.ts`):
  - `setupViteMiddleware()` - Adds Vite middleware for dev
  - `setupStaticServer()` - Serves static files + SPA fallback for prod

### Styling & Dark Mode
- Uses **Tailwind CSS** with dark mode support (`dark:` prefix)
- Global theme variables in `src/index.css` (CSS variables for background/foreground)
- Responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Color scheme auto-detects system preference via `prefers-color-scheme`

## Important Development Rules

1. **Package Manager**: Always use `pnpm`. The `preinstall` script prevents npm/yarn.
2. **TypeScript**: Use strict mode enabled in `tsconfig.json`. Avoid `any` types, use `unknown` or specific types.
3. **API Design**:
   - All routes must start with `/api`
   - Use RESTful conventions (GET/POST/PUT/DELETE)
   - Return JSON with consistent structure
4. **Frontend State Management**: No framework (Vue, React). Uses plain TypeScript and DOM manipulation.
5. **Tool Addition**: To add a new tool:
   1. Add to `tools` array in `src/main.ts`
   2. Create `render[ToolName]()` function
   3. Create `init[ToolName]Events()` function
   4. Add case to `renderTool()` switch statement

## Configuration Details

### TypeScript Config
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- DOM and Node types available

### Vite Config
- Dev server: port 5000, host 0.0.0.0
- HMR: Custom path `/hot/vite-hmr` with port 6000
- File watch: Uses polling (100ms interval) for compatibility

### ESLint Config
- Uses `@eslint/js` + `typescript-eslint` recommended configs
- Ignores: `dist/`, `dist-server/`, `node_modules/`, `scripts/`

## Common Development Scenarios

### Adding a New API Endpoint
1. Add handler to `server/routes/index.ts`
2. Use `/api/` prefix
3. Call from frontend using `fetch('/api/endpoint-name')`

### Modifying Frontend UI
- Edit `src/main.ts` (contains all HTML/CSS generation)
- Update tool rendering function or add new tool following the pattern above
- Use Tailwind CSS classes for styling
- Support dark mode with `dark:` prefix

### Building & Deploying
1. Run `pnpm build` locally to create `dist/` and `dist-server/`
2. Deploy entire project to server
3. Run `pnpm install --prod` on server
4. Run `pnpm start` to launch

## Dependency Notes

- **@supabase/supabase-js**: Installed but not currently used
- **dotenv**: For environment variable loading (create `.env` for client vars with `VITE_` prefix)
- **express**: Backend framework
- **vite**: Frontend bundler with HMR
- **typescript-eslint**: Type-aware linting
- **tsup**: TypeScript bundler for server code (CommonJS output)
- **tsx**: TypeScript runtime for development

## Environment Variables

- Client-side: Must start with `VITE_` prefix (e.g., `VITE_API_URL`)
- Server-side: Any environment variable is accessible via `process.env`
- Use `.env` file in root directory
- In production, set via deployment platform environment variables
