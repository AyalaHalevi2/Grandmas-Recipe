# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grandmas Recipes ("Savta Rina's Recipes") - A full-stack Hebrew recipe management website with RTL layout support.

## Development Commands

### Backend (server/)
```bash
cd server
npm install
npm run seed      # Seed database with admin user and sample recipes
npm run dev       # Start dev server (port 5000)
npm run build     # Compile TypeScript
npm start         # Run compiled JS
```

### Frontend (client/)
```bash
cd client
npm install
npm run dev       # Start Vite dev server (port 5173)
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
```

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

## Architecture

### Backend (Express + TypeScript + MongoDB)

**MVC Pattern:**
- `server/src/models/` - Mongoose schemas (User, Recipe)
- `server/src/controllers/` - Business logic
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

## Design System

**Colors (from _variables.scss):**
- Primary: Sage green (#5E8A75)
- Secondary: Dark blue (#254258)
- Background: Off-white (#F7F7F7)

**Styling:** SCSS Modules with RTL support for Hebrew interface

## Default Admin Credentials

- Email: `admin@rina.com`
- Password: `IAmAdmin19296157#`
