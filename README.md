# Momentum - Vue recruitment task

## Description

This Vue.js application allows users to browse the Polish football league table, view team details, and manage match results.

## Technologies used

- Vue.js
- Tailwind CSS
- Nuxt.js

## Implemented Changes

The project underwent a comprehensive refactoring from a monolithic app.vue file to a modular architecture:

1. **Component Decomposition** - Extracted repeating UI elements into separate reusable components
2. **Pinia Store Implementation** - Migrated logic to centralized state management
3. **Nuxt Routing** - Implemented routing system for team list and detail views
4. **Common Layout** - Created a shared layout with header and footer
5. **New Functionality** - Added ability to add new matches
6. **TypeScript Integration** - Fully typed components, functions, and data

## System Requirements

- Node.js >= 20.12.0
- npm >= 8.0.0 or pnpm >= 8.0.0 or yarn >= 1.22.0

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```
