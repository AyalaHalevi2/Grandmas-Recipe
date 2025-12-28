# Grandmas Recipes

A full-stack recipe management website dedicated to preserving and sharing authentic recipes. This application offers a modern, Hebrew-language interface for browsing, searching, and managing recipes, featuring a secure admin dashboard for content curation.

## Features

### Public User Features

- **Authentic Interactions**:
  - **Browse & Search**: Explore recipes by category or search by name.
  - **Filtering & Sorting**: Filter by difficulty or prep time; sort by rating or alphabetically.
  - **Rich Recipe Details**: View ingredients, step-by-step instructions, prep time, and difficulty.
- **Engagement**:
  - **Rate Recipes**: Give 1-5 star ratings.
  - **Favorites**: Save loved recipes to a personal favorites list.
- **Localization**: Fully localized Hebrew interface with RTL layout support.

### Admin Features

- **Authentication**: Secure email/password login.
- **Recipe Management**: Create, Read, Update, and Delete (CRUD) recipes.
- **User Overview**: View a list of registered users.

## Tech Stack

### Frontend

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: SCSS Modules
- **Routing**: React Router v7

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Local)
- **ORM**: Mongoose

### Security

- **Authentication**: Custom email-based auth
- **Password Hashing**: Bcrypt
- **Session Management**: HttpOnly Cookies

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017)

## Installation & Running

### 1. Backend Setup

```bash
cd server
npm install

# Seed the database with the admin user and sample recipes
npm run seed

# Start the development server (Defaults to port 5000)
npm run dev
```

### 2. Frontend Setup

Open a new terminal window:

```bash
cd client
npm install

# Start the development server (Defaults to port 3000)
npm run dev
```

The application should now be accessible at `http://localhost:3000`.

## Default Admin Credentials

To access the admin dashboard and manage recipes, use the following seeded account:

- **Email**: `admin@user.com`
- **Password**: `IAmAdmin19296157#`

## Project Structure

```
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── store/       # Redux state management
│   │   ├── services/    # API integration
│   │   └── styles/      # Global styles and variables
├── server/              # Express Backend
│   ├── src/
│   │   ├── config/      # DB Connection
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Mongoose Schemas
│   │   └── routes/      # API Endpoints
```
