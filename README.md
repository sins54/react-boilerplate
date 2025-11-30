# React Enterprise Boilerplate

Enterprise-grade **React + Vite + TypeScript** boilerplate featuring Generic Tables, RBAC (Role-Based Access Control), i18n (Internationalization), and a Phantom Backend powered by MSW.

## ✨ Key Features

- **⚡ Vite + React 19** — Lightning-fast development with Hot Module Replacement
- **🎨 Tailwind CSS v4 (No-Hex)** — Design system using CSS variables exclusively
- **🔐 RBAC Permission System** — Screen + Privilege based access control
- **🌍 i18n Ready** — Multi-language support (English, Korean, Nepali)
- **🧪 MSW Phantom Backend** — Full API mocking with realistic data via Faker.js
- **📝 Zod + React Hook Form** — Type-safe form validation with i18n error messages
- **📊 TanStack Query + Table** — Server state management and powerful data tables
- **🎯 Radix UI Primitives** — Accessible, unstyled component foundations
- **📖 Storybook** — Interactive component documentation and development
- **✅ Vitest + Testing Library** — Comprehensive testing setup

---

## 🚀 Quick Start

Get up and running in under 5 minutes.

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd react-boilerplate

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Setup

Create a `.env` file in the root directory (optional for development):

```env
# API Base URL (defaults to /api when using MSW mock backend)
VITE_API_BASE_URL=https://api.your-domain.com
```

> **Note:** During development, the MSW Phantom Backend intercepts all `/api` requests. No `.env` configuration is required to get started.

### Test Accounts

Login at `/login` with these credentials to explore the app:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `admin@example.com` | `password` | Admin | Full access to all screens |
| `user@example.com` | `password` | User | Limited access (Dashboard, Badges) |

> **Tip:** Use the Admin account to see the full UI with all features enabled.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
npm run storybook    # Launch Storybook component gallery
```

---

## 📂 Architecture Map

```
react-boilerplate/
├── public/
│   ├── locales/              # 🌍 i18n translation JSON files
│   │   ├── en/               #    English translations
│   │   ├── ko/               #    Korean translations
│   │   └── ne/               #    Nepali translations
│   └── mockServiceWorker.js  # MSW service worker (auto-generated)
├── src/
│   ├── api/                  # 🔌 Generic Axios client & API utilities
│   │   ├── client.ts         #    Axios instance with interceptors
│   │   ├── generic-api.ts    #    Type-safe API functions (apiGet, apiPost, etc.)
│   │   └── index.ts          #    Barrel export
│   ├── components/           # 🧩 UI Component Library
│   │   ├── ui/               #    Radix + Tailwind primitives
│   │   ├── form/             #    Form components (Input, Select, etc.)
│   │   ├── layout/           #    Layout components (Sidebar, Header)
│   │   ├── data-display/     #    Cards, Tables, Badges
│   │   └── overlay/          #    Modals, Dropdowns, Tooltips
│   ├── context/              # 🔐 React Context providers
│   │   └── AuthContext.tsx   #    Authentication & permissions state
│   ├── hooks/                # 🪝 Custom React hooks
│   │   ├── useFetch.ts       #    React Query wrapper for GET
│   │   └── useGenericMutation.ts # React Query wrapper for mutations
│   ├── lib/                  # 📚 Utility libraries
│   │   ├── i18n.ts           #    i18next configuration
│   │   └── zod-config.ts     #    Zod with i18n error messages
│   ├── mocks/                # 🎭 MSW Phantom Backend
│   │   ├── browser.ts        #    MSW browser setup
│   │   └── handlers/         #    API mock handlers (auth, badges, etc.)
│   ├── pages/                # 📄 Page components
│   ├── routes/               # 🛤️ Routing & access control
│   │   ├── AppRoutes.tsx     #    Main route configuration
│   │   ├── PrivateRoute.tsx  #    Auth-required wrapper
│   │   ├── ProtectedRoute.tsx #   RBAC permission wrapper
│   │   └── PublicRoute.tsx   #    Unauthenticated-only wrapper
│   ├── styles/               # 🎨 CSS & design tokens
│   │   └── colors.css        #    Semantic color variables
│   ├── types/                # 📝 TypeScript type definitions
│   └── App.tsx               # 🚀 Root application component
└── docs/                     # 📖 Detailed documentation
```

---

## 📚 Documentation Index

For detailed information on specific topics, refer to these specialized guides:

| Document | Description |
|----------|-------------|
| [Design System & Theming](./DESIGN-SYSTEM.md) | CSS variables, color palette, typography, and the "No-Hex" principle |
| [Routing & Permissions](./docs/ROUTING-SYSTEM.md) | RBAC system, protected routes, and permission hooks |
| [Generic API & Query](./docs/GENERIC-API.md) | Axios client, React Query hooks, and data fetching patterns |
| [Phantom Backend (MSW)](./docs/PHANTOM-BACKEND.md) | Mock API setup, test accounts, and adding new endpoints |
| [Internationalization](./docs/I18N.md) | Multi-language support, adding translations, and Zod integration |
| [Testing Guide](./docs/TESTING.md) | Vitest configuration, testing patterns, and best practices |
| [Storybook Guide](./docs/STORYBOOK.md) | Component documentation, writing stories, and deployment |

> **Note:** `DESIGN-SYSTEM.md` is located in the project root for quick access. All other documentation files are in the `docs/` directory.

---

## 🛠 Common Developer Tasks

### How to Add a New API Endpoint

**Step 1:** Add the MSW handler in `src/mocks/handlers/`

```typescript
// src/mocks/handlers/projects.ts
import { http, HttpResponse, delay } from 'msw';
import { faker } from '@faker-js/faker';

export const projectHandlers = [
  http.get('/api/projects', async () => {
    await delay(300);
    const projects = Array.from({ length: 10 }, () => ({
      id: faker.string.uuid(),
      name: faker.company.name(),
      status: faker.helpers.arrayElement(['active', 'completed']),
    }));
    return HttpResponse.json({ data: projects });
  }),
];
```

**Step 2:** Register the handler in `src/mocks/handlers/index.ts`

```typescript
import { projectHandlers } from './projects';

export const handlers = [
  ...authHandlers,
  ...badgeHandlers,
  ...projectHandlers, // Add here
];
```

**Step 3:** Create a React Query hook in your component or `src/hooks/`

```typescript
import { useFetch } from '@/hooks';

function ProjectList() {
  const { data, isLoading } = useFetch<Project[]>('projects', '/api/projects');
  // ...
}
```

---

### How to Create a New Protected Page

**Step 1:** Create your page component

```typescript
// src/pages/ReportsPage.tsx
export function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      {/* Your content */}
    </div>
  );
}
```

**Step 2:** Add the route with permission in `src/routes/AppRoutes.tsx`

```tsx
import { ReportsPage } from '@/pages/ReportsPage';

// Inside the PrivateRoute wrapper
<Route
  path="/reports"
  element={
    <ProtectedRoute screen="REPORTS" privilege="VIEW">
      <ReportsPage />
    </ProtectedRoute>
  }
/>
```

**Step 3:** (Optional) Add the screen type if new in `src/types/auth.ts`

```typescript
export type Screen =
  | "BADGE"
  | "PROJECT"
  | "USERS"
  | "DASHBOARD"
  | "SETTINGS"
  | "REPORTS"; // Already exists, but add new ones here
```

---

### How to Add a Translation

**Step 1:** Add the key to `public/locales/en/common.json`

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "exportReport": "Export Report"
  }
}
```

**Step 2:** Add translations to other languages (`ko`, `ne`)

```json
// public/locales/ko/common.json
{
  "buttons": {
    "exportReport": "보고서 내보내기"
  }
}
```

**Step 3:** Use the translation in your component

```tsx
import { useTranslation } from 'react-i18next';

function ExportButton() {
  const { t } = useTranslation('common');
  
  return <button>{t('buttons.exportReport')}</button>;
}
```

---

## 🤝 Contributing

1. Follow the **No-Hex** rule: Use CSS variables (`var(--color-*)`) exclusively
2. Write tests for new components and features
3. Add Storybook stories for UI components
4. Ensure all translations are complete for supported languages
5. Run `npm run lint` and `npm run test:run` before submitting PRs

---

## 📄 License

This project is available for use under your organization's license terms.

---

<div align="center">
  <strong>Built with ❤️ for enterprise-grade React applications</strong>
</div>
