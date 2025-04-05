# Recipe Haven Backend

This is the backend server for Recipe Haven, a recipe sharing platform built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret_key` with a secure secret key for JWT token generation.

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (protected)
- PUT `/api/users/profile` - Update user profile (protected)

### Recipes
- GET `/api/recipes` - Get all recipes
- GET `/api/recipes/:id` - Get recipe by ID
- POST `/api/recipes` - Create new recipe (protected)
- PUT `/api/recipes/:id` - Update recipe (protected)
- DELETE `/api/recipes/:id` - Delete recipe (protected)
- POST `/api/recipes/:id/like` - Toggle recipe like (protected)

### Comments
- GET `/api/recipes/:recipeId/comments` - Get comments for a recipe
- POST `/api/recipes/:recipeId/comments` - Create comment (protected)
- PUT `/api/comments/:id` - Update comment (protected)
- DELETE `/api/comments/:id` - Delete comment (protected) 