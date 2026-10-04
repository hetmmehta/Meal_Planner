import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { DELETE_RECIPE, GET_RECIPES, errorMessage } from '../graphql/recipe.operations';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;

  /** Recipe whose delete confirmation is currently showing. */
  confirmingId: string | null = null;
  deletingId: string | null = null;
  actionError: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.loadRecipes();
  }

  // 🧭 Load all recipes (kept in sync with the Apollo cache)
  loadRecipes() {
    this.apollo
      .watchQuery({ query: GET_RECIPES })
      .valueChanges.subscribe({
        next: (result) => {
          this.recipes = result.data?.recipes ?? [];
          this.loading = result.loading;
          this.error = null;
        },
        error: (err) => {
          this.error = errorMessage(err);
          this.loading = false;
        },
      });
  }

  // 🗑️ Ask for confirmation inline on the card
  askDelete(id: string, event: MouseEvent) {
    event.stopPropagation(); // prevent card click
    this.actionError = null;
    this.confirmingId = id;
  }

  cancelDelete(event: MouseEvent) {
    event.stopPropagation();
    this.confirmingId = null;
  }

  confirmDelete(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deletingId = id;

    this.apollo
      .mutate({
        mutation: DELETE_RECIPE,
        variables: { id },
        // Re-fetch the list so it reflects what the server now has.
        refetchQueries: [{ query: GET_RECIPES }],
        awaitRefetchQueries: true,
      })
      .subscribe({
        next: (res) => {
          if (!res.data?.deleteRecipe) {
            this.actionError = 'That recipe was already deleted.';
          }
          this.deletingId = null;
          this.confirmingId = null;
        },
        error: (err) => {
          this.actionError = `Could not delete recipe: ${errorMessage(err)}`;
          this.deletingId = null;
          this.confirmingId = null;
        },
      });
  }

  // 👁️ Navigate to recipe detail page
  viewRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  trackById(_index: number, recipe: Recipe) {
    return recipe.id;
  }
}
