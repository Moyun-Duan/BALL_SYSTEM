# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ball_system** is a sports social platform for university students to find teammates, match with other players, and book sports venues. Built with Taro (cross-platform framework) and React, targeting WeChat mini-program and other platforms.

## Architecture

- **Framework**: Taro 4.1.11 with React 18 and TypeScript
- **Compiler**: Vite (configured in babel.config.js)
- **Target Platforms**: WeChat mini-program (primary), Alipay, ByteDance, Swan, QQ, JD, Harmony
- **Path Alias**: `@/*` maps to `./src/*`
- **Output**: Compiled to `./dist` for mini-program deployment

### Key Files

- `src/app.ts` - Root React component, handles app lifecycle via `useLaunch`
- `src/app.config.ts` - App configuration (pages, window settings)
- `src/pages/` - Page components (each page has `.tsx`, `.config.ts`, `.scss`)
- `config/` - Build configuration files
- `project.config.json` - WeChat mini-program project settings

## Development Commands

```bash
# Development (watch mode)
npm run dev:weapp      # WeChat mini-program
npm run dev:h5         # Web/H5
npm run dev:alipay     # Alipay
npm run dev:tt         # ByteDance
npm run dev:swan       # Swan
npm run dev:qq         # QQ
npm run dev:jd         # JD
npm run dev:harmony-hybrid  # Harmony

# Production builds
npm run build:weapp
npm run build:h5
# ... other platforms

# Create new page
npm run new
```

## Code Quality

- **Linting**: ESLint (extends `taro/react`, React 18 JSX rules disabled)
- **Styling**: Stylelint with standard config
- **Commit Hooks**: Husky + commitlint (conventional commits)
- **Staged Linting**: lint-staged runs on pre-commit

## TypeScript Configuration

- Target: ES2017
- Module: CommonJS
- JSX: react-jsx (automatic runtime)
- Strict null checks enabled
- No unused locals/parameters allowed
- Source maps enabled for debugging

## Environment Variables

- `.env.development` - Dev environment
- `.env.production` - Production environment
- `.env.test` - Test environment

## Important Notes

- Taro abstracts platform differences; use Taro APIs (`@tarojs/taro`) instead of platform-specific APIs
- Pages must be registered in `src/app.config.ts` before they're accessible
- Use `@/` path alias for imports from src directory
- WeChat mini-program is the primary target; test on other platforms before release
