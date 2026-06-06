# Warehouse Platform — Admin Dashboard

A modern, responsive admin dashboard for the Warehouse Platform — a warehouse management system with 3D visualization, plan management, user administration, and AI-powered picking.

---

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 21.2.14 |
| TypeScript | 5.9.x |
| NgRx SignalStore | 21.x |
| Angular Material (CDK + Dialog + Table) | 21.x |
| Tailwind CSS | 4.x |
| RxJS | 7.x |

---

## Features

- **Authentication** — JWT-based login with token persistence, auto-validation on startup via `provideAppInitializer`
- **Role-based access** — `ADMIN` and `USER` roles with route guards and sidebar filtered by role
- **Responsive sidebar** — collapsible on desktop, overlay on tablet, slide-in drawer on mobile; supports nested navigation with animated expand/collapse
- **Per-route layout config** — topbar transparency, sidebar auto-collapse declared directly in route `data`
- **Theme switching** — dark/light mode with system default detection, persisted in `localStorage`, flash-free via inline `<script>` in `index.html`
- **Notification service** — animated toast notifications (success, error, warning, info)
- **Dialog service** — confirm and prompt dialogs built on `MatDialog` with custom dark styling
- **Custom UI layer** — reusable CSS component classes (`ui-input`, `ui-btn-*`, `ui-badge-*`, etc.) via Tailwind `@layer components`
- **SVG icon system** — sprite-based icon system generated from Figma exports via build script

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/              # AuthService, AuthStore (SignalStore), authGuard, roleGuard
│   │   ├── interceptors/      # authInterceptor, errorInterceptor
│   │   ├── models/            # user.model.ts, api-response.model.ts
│   │   └── services/          # ThemeService, LayoutService, BreakpointService
│   ├── features/
│   │   ├── auth/              # LoginComponent
│   │   ├── dashboard/
│   │   ├── users/             # UsersComponent, UsersStore, UsersService, users.routes.ts
│   │   ├── plans/             # PlansComponent + nested pages, plans.routes.ts
│   │   ├── warehouse-3d/
│   │   ├── tariff-configurator/
│   │   ├── services-groups/
│   │   └── picking-ia/
│   ├── layouts/
│   │   ├── admin-layout/      # Sidebar + Topbar shell with router-outlet
│   │   └── auth-layout/       # Centered card shell
│   └── shared/
│       ├── components/
│       │   ├── sidebar/       # SidebarComponent, SidebarNavItemComponent, sidebar.config.ts
│       │   ├── topbar/
│       │   ├── icon/          # IconComponent (SVG sprite wrapper)
│       │   ├── form-field/    # FormFieldComponent (label + error wrapper)
│       │   ├── notifications/ # NotificationsComponent
│       │   └── dialog/        # ConfirmDialogComponent, PromptDialogComponent
│       └── services/
│           └── dialog.service.ts
├── styles/
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _components.scss       # Imports all component partials
│   ├── _typography.scss
│   └── components/
│       ├── _buttons.scss
│       ├── _inputs.scss
│       ├── _checkbox.scss
│       ├── _toggle.scss
│       ├── _badge.scss
│       ├── _card.scss
│       ├── _sidebar.scss
│       ├── _dialog.scss
│       └── _form-field.scss
├── assets/
│   └── icons/
│       ├── svg/               # Source SVG exports from Figma
│       └── sprite.svg         # Generated sprite (do not edit manually)
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
ng serve
```

App runs at `http://localhost:4207`. API proxy expects backend at `http://localhost:3000`.

### Build

```bash
ng build
```

### Rebuild icon sprite

After adding new SVG files to `src/assets/icons/svg/`:

```bash
node scripts/build-sprite.mjs
```

---

## Backend

This dashboard connects to a NestJS REST API. See the backend repository for setup instructions.

**API base URL** is configured in:
- `src/environments/environment.ts` — development
- `src/environments/environment.prod.ts` — production

### Key endpoints used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login, returns JWT |
| `GET` | `/auth/profile` | Validate token, get current user |
| `GET` | `/users/list` | List all users |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |
| `PUT` | `/users/:id/assign-plan` | Assign plan to user |
| `GET` | `/plan/list` | List all plans |
| `POST` | `/plan` | Create plan |
| `PUT` | `/plan/:id` | Update plan |
| `GET` | `/service/list` | List services |
| `GET` | `/service/category/list` | List service categories |

---

## Architecture Notes

### State Management

Each feature manages its own state via **NgRx SignalStore** scoped to the feature component (`providers: [FeatureStore]`). The `AuthStore` is global (`providedIn: 'root'`).

### Routing

Routes are split into feature route files (`feature.routes.ts`) and lazy-loaded via `loadChildren`. The root `app.routes.ts` only declares top-level paths.

### Layout Configuration

Per-route layout behavior (topbar visibility, sidebar collapse) is declared in route `data`:

```ts
{
  path: 'warehouse-3d',
  data: { layout: { topbarTransparent: true, sidebarCollapsed: true } },
  loadChildren: () => import('./features/warehouse-3d/warehouse-3d.routes')
    .then(m => m.WAREHOUSE_3D_ROUTES),
}
```

### UI Components

Reusable styles are defined as Tailwind `@layer components` classes (`ui-input`, `ui-btn-primary`, `ui-badge-success`, etc.) in `src/styles/components/`. Angular components are used only where behavior or content projection is needed (`app-form-field`, `app-icon`, `app-notifications`).