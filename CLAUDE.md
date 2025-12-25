# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grandmas Recipes ("Savta Rina's Recipes") - A full-stack Hebrew recipe management website with RTL layout support.

## TypeScript Rules (STRICT)

**ALWAYS follow these rules when writing code:**

1. **Strict mode is mandatory** - All TypeScript configs use `"strict": true`
2. **No `any` types** - Never use `any`. Use proper types, `unknown`, or generics
3. **No implicit any** - All function parameters and return types must be explicitly typed
4. **Type all variables** - When type cannot be inferred, add explicit type annotations
5. **Use interfaces/types** - Define interfaces for all objects, API responses, props
6. **Validate at boundaries** - Use Valibot schemas for all user input (forms, API requests)

```typescript
// BAD
const handleData = (data) => { ... }
const items: any[] = [];

// GOOD
const handleData = (data: UserInput): ValidationResult => { ... }
const items: Recipe[] = [];
```

## Development Commands

### From Root (Recommended)
```bash
npm install       # Install all workspaces
npm run dev       # Run client + server together
npm run build     # Build everything
```

### Individual Packages
```bash
npm run dev:client    # Vite dev server (port 5173)
npm run dev:server    # Express dev server (port 5000)
npm run build:shared  # Build shared validation schemas
```

### Database
```bash
cd server && npm run seed   # Seed with admin user and sample recipes
```

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

## Architecture

### Monorepo Structure
```
grandmas-recipes/
├── packages/shared-schemas/   # Shared Valibot validation schemas
├── client/                    # React frontend
├── server/                    # Express backend
└── package.json               # Workspace root
```

### Backend (Express + TypeScript + MongoDB)

**MVC Pattern:**
- `server/src/models/` - Mongoose schemas (User, Recipe)
- `server/src/controllers/` - Business logic (with Valibot validation)
- `server/src/routes/` - API endpoint definitions
- `server/src/middleware/auth.ts` - Authentication middleware (isAuthenticated, isAdmin)

**API Routes:**
- `/api/auth` - register, login, logout, getCurrentUser (GET /me)
- `/api/recipes` - CRUD operations (admin-only for create/update/delete)
- `/api/users` - User management

**Authentication:** Cookie-based sessions using `userId` cookie. Passwords hashed with bcrypt.

### Frontend (React 19 + Vite + TypeScript)

**State Management:** Redux Toolkit with two slices:
- `authSlice` - User authentication state
- `recipeSlice` - Recipe data and filters

**Key Directories:**
- `client/src/pages/` - Route components (Home, Login, Register, Recipes, RecipeDetail, Favorites, Admin)
- `client/src/components/` - Reusable UI (Header, Footer, RecipeCard, Dropdown)
- `client/src/store/` - Redux store, slices, and typed hooks
- `client/src/services/api.ts` - Axios instance (baseURL: localhost:5000/api)
- `client/src/styles/` - SCSS variables and global styles

**Routing:** React Router v7 with routes defined in App.tsx

### Data Models

**User:** email (unique), fullName, password (hashed), role ('admin'|'user'), favorites (Recipe refs)

**Recipe:** title, category, ingredients[], instructions[], prepTime (minutes), difficulty (1-5), ratings[], averageRating (computed), imageUrl, isYemeni, kosherType ('Parve'|'Dairy'|'Meat')

## Shared Validation (`@grandmas-recipes/shared-schemas`)

**One source of truth for validation** - same schemas used on client and server.

```typescript
import { validate, LoginSchema, CreateRecipeSchema } from '@grandmas-recipes/shared-schemas';

// Simple usage
const result = validate(LoginSchema, formData);

if (!result.success) {
  console.log(result.errors);  // { email: "כתובת אימייל לא תקינה" }
  return;
}

// Use typed, validated data
const { email, password } = result.data;
```

**Available schemas:**
- `LoginSchema`, `RegisterSchema`, `RegisterWithConfirmSchema`
- `CreateRecipeSchema`, `UpdateRecipeSchema`, `RateRecipeSchema`, `RecipeIdSchema`

## Design System

**Colors (from _variables.scss):**
- Primary: Sage green (#5E8A75)
- Secondary: Dark blue (#254258)
- Background: Off-white (#F7F7F7)

**Styling:** SCSS Modules with RTL support for Hebrew interface

## Default Admin Credentials

- Email: `admin@rina.com`
- Password: `IAmAdmin19296157#`
