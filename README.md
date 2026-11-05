# NÓW Marketplace

**A modern marketplace application** inspired by Vinted, built with React + TypeScript + Firebase.

Users can buy and sell items, search with filters, manage favorites, and upload product images. The MVP focuses on core functionality: authentication, listings CRUD, search, and favorites management.

## 📚 Project Documentation

- **[Project Roadmap](docs/roadmap.md)** ← Start here! Overview, sprint timeline, and MVP criteria
- **[Full Implementation Plan](docs/implementation-plan.md)** – Detailed 6-sprint plan with all tasks and acceptance criteria
- **[CLAUDE.md](CLAUDE.md)** – Project constraints, architecture standards, workflow

## 🛠️ Tech Stack

- **Frontend:** React 19.3 + TypeScript 6.0 + Vite 8.3
- **State:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Backend:** Firebase (Auth + Firestore + Cloud Storage)
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library + Playwright

## 🚀 Quick Start

```bash
npm install
npm run dev
```

See [Project Roadmap](docs/roadmap.md) for detailed setup instructions (coming soon).

---

# Template Info: React + TypeScript + Vite

This project uses Vite with React Compiler enabled. For more information:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
