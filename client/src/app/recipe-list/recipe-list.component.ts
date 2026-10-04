import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const GET_RECIPES = gql`
  query {
    recipes {
      id
      title
      description
      category
      cookTime
      ingredients
      steps
      imageUrl
      createdAt
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  loading = true;
  error: any;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.loadRecipes();
  }

  // 🧭 Load all recipes
  loadRecipes() {
    this.apollo
      .watchQuery({
        query: GET_RECIPES,
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.recipes = result?.data?.recipes ?? [];
          this.loading = result.loading;
          this.error = null;
        },
        error: (err) => {
          console.error('GraphQL error:', err);
          this.error = err;
          this.loading = false;
        },
      });
  }

  // 🗑️ Delete a recipe
  deleteRecipe(id: string, event: MouseEvent) {
    event.stopPropagation(); // prevent card click
    if (!confirm('🗑️ Are you sure you want to delete this recipe?')) return;

    this.apollo
      .mutate({
        mutation: DELETE_RECIPE,
        variables: { id },
      })
      .subscribe({
        next: (res: any) => {
          if (res?.data?.deleteRecipe) {
            this.recipes = this.recipes.filter((r) => r.id !== id);
          } else {
            alert('❌ Failed to delete recipe.');
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('❌ Error deleting recipe.');
        },
      });
  }

  // 👁️ Navigate to recipe detail page
  viewRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }
}
