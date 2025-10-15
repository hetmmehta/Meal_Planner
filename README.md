🥗 Recipe & Meal Planner

A full-stack web app built with Angular, Node.js, Apollo GraphQL, and MongoDB that allows users to create, view, and delete recipes — with real-time updates through GraphQL.

🌐 Live Demo (optional)

Coming soon...

⚙️ Tech Stack
Layer	Technology
Frontend	Angular 17 + Apollo Client + TypeScript
Backend	Node.js + Apollo Server + Express
Database	MongoDB (Mongoose ODM)
GraphQL	Queries + Mutations for recipe management
Styling	Custom CSS (responsive grid layout)
🧩 Features

✅ View all recipes in a clean card layout
✅ Add new recipes (title, ingredients, instructions)
✅ Delete recipes via a hover ✖ icon
✅ Separate “Add Recipe” page via Angular Router
✅ Connected to GraphQL API (/graphql) with Apollo Angular

🗂️ Project Structure
meal-planner/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── recipe-list/        # Recipe list & delete
│   │   │   ├── pages/add-recipe/   # Add recipe form
│   │   │   ├── graphql.module.ts   # Apollo client setup
│   │   │   ├── app-routing.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── app.component.ts
│   └── package.json
│
├── server/                # Node + GraphQL backend
│   ├── src/
│   │   ├── index.js        # Express + Apollo Server
│   │   ├── models/Recipe.js
│   │   ├── graphql/schema.js
│   │   ├── graphql/resolvers.js
│   └── package.json
│
└── README.md

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/meal-planner.git
cd meal-planner

2️⃣ Set Up & Run the Backend
cd server
npm install
npm run dev


Server starts at:
👉 http://localhost:4000/graphql

3️⃣ Set Up & Run the Frontend

Open a new terminal tab:

cd client
npm install
ng serve


Client starts at:
👉 http://localhost:4200

🧠 Example GraphQL Queries
🔍 Fetch All Recipes
query {
  recipes {
    id
    title
    ingredients
    instructions
  }
}

➕ Add a Recipe
mutation {
  addRecipe(input: {
    title: "Mango Smoothie",
    ingredients: ["Mango", "Yogurt", "Honey"],
    instructions: "Blend everything and chill."
  }) {
    id
    title
  }
}

❌ Delete a Recipe
mutation {
  deleteRecipe(id: "RECIPE_ID")
}

🧑‍💻 Development Notes

The frontend and backend run independently.

Ensure MongoDB is running locally or update your .env file with your cluster URI.

Apollo Client auto-refreshes recipe list after mutations.

🏗️ Future Enhancements

✏️ Edit Recipe feature

🗓️ Weekly meal planner view

🔖 Add tags & categories

📸 Image upload for recipes

🧠 Smart suggestions using AI

📜 License

MIT © 2025 Your Name