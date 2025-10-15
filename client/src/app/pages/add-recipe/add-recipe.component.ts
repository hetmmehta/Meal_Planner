import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const ADD_RECIPE = gql`
  mutation AddRecipe($input: RecipeInput!) {
    addRecipe(input: $input) {
      id
      title
      ingredients
      instructions
      createdAt
    }
  }
`;

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent {
  title = '';
  ingredients = '';
  instructions = '';
  loading = false;
  successMsg = '';

  constructor(private apollo: Apollo, private router: Router) {}

  addRecipe() {
    if (!this.title.trim() || !this.ingredients.trim()) return;

    this.loading = true;
    const ingredientsArray = this.ingredients.split(',').map(i => i.trim());

    this.apollo.mutate({
      mutation: ADD_RECIPE,
      variables: {
        input: {
          title: this.title,
          ingredients: ingredientsArray,
          instructions: this.instructions,
        },
      },
    })
    .subscribe({
      next: () => {
        this.successMsg = '✅ Recipe added successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        console.error('Error adding recipe:', err);
        this.loading = false;
      },
    });
  }
}
