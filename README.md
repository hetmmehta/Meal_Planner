# 🥗 Recipe Notebook

[![CI](https://github.com/hetmmehta/Meal_Planner/actions/workflows/ci.yml/badge.svg)](https://github.com/hetmmehta/Meal_Planner/actions/workflows/ci.yml)

A full-stack recipe manager built with **Angular 17**, **Apollo Client**, **Node.js/Express + Apollo Server**, and **MongoDB**. You can browse, add, edit, view and delete recipes through a GraphQL API.

## ⚙️ Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | Angular 17 (NgModule + Router), TypeScript, Apollo Angular       |
| Backend  | Node.js, Express 5, Apollo Server (`@apollo/server`)             |
| Database | MongoDB with Mongoose                                            |
| API      | GraphQL queries and mutations                                    |
| Testing  | `node:test` + mongodb-memory-server (server), Karma/Jasmine (client) |
| CI       | GitHub Actions (server tests, client build and tests)           |

## 🧩 Features

- **Recipe list:** a card grid, newest first, showing image, category and cook time
- **Recipe detail page** (`/recipe/:id`): description, ingredient list and numbered steps
- **Add and edit recipes:** title, description, category, cook time, any number of ingredients and steps, and an image (paste a URL or upload a file under 1 MB, stored inline as a data URL)
- **Delete with an inline confirmation** on the card
- **The list stays in sync:** add, update and delete mutations use Apollo `refetchQueries`, so the list reloads from the server after every change
- **Server-side validation:** the title is required, at least one ingredient is required, cook time must be 0–1440 minutes, and images must be http(s) or data URLs. Bad input returns `BAD_USER_INPUT` errors, unknown ids return `NOT_FOUND`, and the client shows these messages inline.

## 🗂️ Project Structure

```
Meal_Planner/
├── client/                          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── recipe-list/         # Home page: recipe cards + delete
│   │   │   ├── pages/add-recipe/    # Add / edit recipe form
│   │   │   ├── pages/recipe-detail/ # Single recipe view
│   │   │   ├── graphql/             # Typed GraphQL operations
│   │   │   ├── models/recipe.ts     # Recipe interfaces
│   │   │   ├── graphql.module.ts    # Apollo Client setup
│   │   │   ├── app-routing.module.ts
│   │   │   └── app.module.ts
│   │   └── environments/            # GraphQL endpoint per build
│   └── package.json
│
├── server/                          # Node + GraphQL backend
│   ├── src/
│   │   ├── index.js                 # Reads env, connects to MongoDB, starts Express
│   │   └── app.js                   # Express app + Apollo Server middleware
│   ├── graphql/
│   │   ├── schema.js                # Type definitions
│   │   ├── resolvers.js             # Query / Mutation resolvers
│   │   └── validation.js            # Input validation helpers
│   ├── models/Recipe.js             # Mongoose model
│   ├── scripts/seed.js              # Sample data
│   ├── test/                        # Server tests
│   ├── .env.example
│   └── package.json
│
├── .github/workflows/ci.yml
├── LICENSE
└── README.md
```

## 🚀 Getting Started

Prerequisites: Node.js 20+ and a MongoDB database (local `mongod` or a free MongoDB Atlas cluster).

### 1. Clone the repository

```bash
git clone https://github.com/hetmmehta/Meal_Planner.git
cd Meal_Planner
```

### 2. Configure and run the backend

```bash
cd server
npm install
cp .env.example .env   # then edit .env
npm run seed           # optional: add a few sample recipes
npm run dev
```

`server/.env` settings:

| Variable      | Required | Default                 | Description                                  |
| ------------- | -------- | ----------------------- | -------------------------------------------- |
| `MONGODB_URI` | yes      | none                    | MongoDB connection string                    |
| `PORT`        | no       | `4000`                  | Port for the GraphQL server                  |
| `CORS_ORIGIN` | no       | `http://localhost:4200` | Allowed browser origin(s), comma separated   |

The API runs at **http://localhost:4000/graphql**. Open it in a browser to use the Apollo Sandbox.

### 3. Run the frontend

In a new terminal:

```bash
cd client
npm install
npm start
```

The app runs at **http://localhost:4200**. In development the client calls `http://localhost:4000/graphql`. Production builds call `/graphql` on the same origin. Both are set in `client/src/environments/`.

### 4. Run the tests

```bash
cd server && npm test                                   # resolvers + validation (in-memory MongoDB)
cd client && npx ng test --watch=false --browsers=ChromeHeadless
```

## 🧠 Example GraphQL Operations

**Fetch all recipes**

```graphql
query {
  recipes {
    id
    title
    category
    cookTime
    ingredients
    steps
    createdAt
  }
}
```

**Fetch one recipe**

```graphql
query {
  recipe(id: "RECIPE_ID") {
    title
    description
    ingredients
    steps
    imageUrl
  }
}
```

**Add a recipe**

```graphql
mutation {
  addRecipe(input: {
    title: "Mango Smoothie"
    description: "A thick, cold smoothie."
    category: "Snack"
    cookTime: 5
    ingredients: ["Mango", "Yogurt", "Honey"]
    steps: ["Blend everything", "Serve chilled"]
  }) {
    id
    title
  }
}
```

**Update a recipe** (replaces the editable fields)

```graphql
mutation {
  updateRecipe(id: "RECIPE_ID", input: {
    title: "Mango Lassi"
    ingredients: ["Mango", "Yogurt", "Cardamom"]
    steps: ["Blend", "Chill"]
  }) {
    id
    title
    ingredients
  }
}
```

**Delete a recipe** (returns `true` if a recipe was deleted)

```graphql
mutation {
  deleteRecipe(id: "RECIPE_ID")
}
```

## 🏗️ Future Enhancements

- 🗓️ Weekly meal planner view
- 🔍 Search and filter by category
- 🖼️ Image storage outside the database (e.g. object storage)
- 🔐 User accounts

## 📜 License

[MIT](LICENSE) © 2026 Het Mehta
