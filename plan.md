# Project Plan: Savta  Recipes

## Overview
A full-stack Hebrew recipe website with email-based authentication, recipe management, and user features.
### Project Context & Core Task
**Current State:** A single-admin recipe website designed for personal/private use.
**Goal:** Transform the platform into a multi-user, community-driven application.
**Key Shift:** The core logic must change from a "Global/Admin-only" view to a "Group-based" access model. Users should see and interact with recipes based on the specific groups they belong to, moving away from a single-user controlled environment.
---

## Tech Stack
- **Frontend:** React, TypeScript, Redux Toolkit, React Router, SCSS Modules
- **Backend:** Node.js, TypeScript, Express
- **Database:** Local MongoDB (Mongoose)
- **Security:** Bcrypt (password hashing), Cookies (session management)

---

## Todo List

### Phase 1: Backend Foundation
- [x] Initialize project structure (server + client folders)
- [x] Setup Server - Node.js/Express/TypeScript with MVC folders
- [x] Configure MongoDB connection with Mongoose

### Phase 2: Backend Data Layer
- [x] Create User model (email, fullName, password, role)
- [x] Create Recipe model (title, category, ingredients, instructions, etc.)

### Phase 3: Backend API
- [x] Implement Auth controllers (register, login, logout)
- [x] Implement Auth routes with session/cookie management
- [x] Implement Recipe controllers (CRUD operations)
- [x] Implement Recipe routes with admin protection
- [x] Create seed script for default admin account

### Phase 4: Frontend Foundation
- [x] Setup Client - React/TypeScript with Redux Toolkit
- [x] Configure Redux store and API slices
- [x] Setup React Router

### Phase 5: Frontend UI (Hebrew/RTL)
- [x] Build Auth pages (Login, Register) in Hebrew
- [x] Build Homepage with categories and search
- [x] Build Recipe pages (list, detail, create/edit for admin)
- [x] Build Admin dashboard (user list, recipe management)

### Phase 6: Styling & Features
- [x] Implement SCSS with RTL support and warm color theme
- [x] Add user features (rating, favorites, filtering, sorting)

---

## Default Admin Account
- **Email:** admin@rina.com
- **Password:** IAmAdmin19296157#

---

## How to Run

### Server
```bash
cd server
npm install
npm run seed    # Seeds database with admin user and sample recipes
npm run dev     # Starts server on port 5000
```

### Client
```bash
cd client
npm install
npm run dev     # Starts client on port 3000
```

### Prerequisites
- MongoDB running locally on port 27017
- Node.js 18+

---

## Project Structure

```
Ayala/
├── server/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── index.ts      # Entry point
│   │   └── seed.ts       # Database seeder
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store & slices
│   │   ├── services/     # API service
│   │   ├── styles/       # Global SCSS
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── plan.md
└── instruction.md
```

---

## Design Notes
- **Language:** Hebrew (RTL support)
- **Theme:** Warm colors (Oranges, Creams, Earthy tones)
- **Architecture:** MVC pattern on backend
