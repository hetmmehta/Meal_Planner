# 🥗 Recipe & Meal Planner

A **full-stack web app** built with **Angular**, **Node.js**, **Apollo GraphQL**, and **MongoDB** that lets you **create, view, and delete recipes** — all connected through GraphQL.

---

## 🚀 Features

- 🧾 View all recipes in a responsive card layout  
- ➕ Add new recipes with title, ingredients, and instructions  
- ❌ Delete recipes via a hover ✖ icon  
- 🔄 Real-time updates via Apollo GraphQL  
- 🧭 Separate `/add-recipe` page with Angular routing  

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | Angular 17, Apollo Angular, TypeScript |
| **Backend** | Node.js, Apollo Server, Express |
| **Database** | MongoDB (Mongoose) |
| **GraphQL** | Queries + Mutations for recipe management |
| **Styling** | Custom CSS with responsive grid layout |

---



## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hetmmehta/Meal_Planner.git
cd meal-planner
```

### 2️⃣ Set Up & Run the Backend
```bash
cd server
npm install
npm run dev
```

Server starts at:
**👉 http://localhost:4000/graphql**

### 3️⃣ Set Up & Run the Frontend

Open a new terminal tab:
```bash
cd client
npm install
ng serve
```

Client starts at:
**👉 http://localhost:4200**

## 🧠 Example GraphQL Queries
### 🔍 Fetch All Recipes
```bash
query {
  recipes {
    id
    title
    ingredients
    instructions
  }
}
```

### ➕ Add a Recipe
```bash
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
```

### ❌ Delete a Recipe
```bash
mutation {
  deleteRecipe(id: "RECIPE_ID")
}
```


## 🧑‍💻 Development Notes
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

MIT © 2025 Het Mehta
