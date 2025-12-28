# Project: Savta Rina's Recipes - Core Development

## Goal
Build a full-stack recipe website for "Savta Rina". The interface must be in **Hebrew**.

## Tech Stack
- **Frontend:** React, TypeScript, Redux Toolkit, React Router, SCSS Modules.
- **Backend:** Node.js, TypeScript, Express.
- **Database:** Local MongoDB (via Mongoose).
- **Security:** Password hashing (Bcrypt), Session management (Cookies).

## Architectural Requirements (Backend)
- **MVC Pattern:** Strictly separate logic into:
    - **Models:** Mongoose schemas.
    - **Controllers:** Functions containing the business logic.
    - **Routes:** Definitions of endpoints that call the appropriate controller functions.
- **Email-Based Auth:** Use `email` as the unique identifier for login/registration instead of a username.

## Data Models
1. **User:**
   - Fields: `email` (String, Unique, Required), `fullName` (String), `password` (Hashed), `role` (Admin/User).
   - **Default Admin Account:** - Email: `admin@user.com`
     - Password: `IAmAdmin19296157#`
2. **Recipe:**
   - Fields: Title, Category, Ingredients (list), Instructions (steps), Prep Time (minutes), Difficulty (1-5), Rating (Average of all users).

## Core Features
- **Authentication:** Register (Email, Name, Password), Login, Logout.
- **Homepage (Hebrew):** Categories, Search by recipe name.
- **Recipe Management:** Admin can CRUD (Create, Read, Update, Delete) recipes.
- **User Features:** Browse, filter (time/difficulty), sort (ABC/Rating), rate (0-5 stars), and favorite.
- **Admin View:** Access to a list of all registered users' names and emails.

## Design & UI
- **Language:** Hebrew (RTL support).
- **Theme:** Warm colors (Oranges, Creams, Earthy tones).
- **Structure:** Clean React components with SCSS Modules.

## Development Steps for Claude Code
1. Initialize project structure with `src/routes`, `src/controllers`, and `src/models`.
2. Setup MongoDB connection and User model (Email-based).
3. Implement Auth Controllers and Routes.
4. Implement Recipe Controllers and Routes.
5. Build the Frontend logic using Redux to sync with the Backend.
