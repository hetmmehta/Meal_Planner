import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            recipes {
              id
              title
              ingredients
              instructions
              createdAt
            }
          }
        `,
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.recipes = result?.data?.recipes ?? [];
          this.loading = result.loading;
        },
        error: (err) => {
          console.error('GraphQL error:', err);
          this.error = err;
        },
      });
  }

  deleteRecipe(id: string) {
    if (!confirm('🗑️ Are you sure you want to delete this recipe?')) return;

    this.apollo
      .mutate({
        mutation: gql`
          mutation DeleteRecipe($id: ID!) {
            deleteRecipe(id: $id)
          }
        `,
        variables: { id },
      })
      .subscribe({
        next: (res: any) => {
          if (res?.data?.deleteRecipe) {
            // remove recipe locally
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
}
